"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _createConnector = _interopRequireDefault(require("../core/createConnector"));

var _indexUtils = require("../core/indexUtils");

var namespace = 'refinementList';

function getId(props) {
  return props.attribute;
}

function getCurrentRefinement(props, searchState, context) {
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, "".concat(namespace, ".").concat(getId(props)), []);

  if (typeof currentRefinement !== 'string') {
    return currentRefinement;
  }

  if (currentRefinement) {
    return [currentRefinement];
  }

  return [];
}

function getValue(name, props, searchState, context) {
  var currentRefinement = getCurrentRefinement(props, searchState, context);
  var isAnewValue = currentRefinement.indexOf(name) === -1;
  var nextRefinement = isAnewValue ? currentRefinement.concat([name]) // cannot use .push(), it mutates
  : currentRefinement.filter(function (selectedValue) {
    return selectedValue !== name;
  }); // cannot use .splice(), it mutates

  return nextRefinement;
}

function getLimit(_ref) {
  var showMore = _ref.showMore,
      limit = _ref.limit,
      showMoreLimit = _ref.showMoreLimit;
  return showMore ? showMoreLimit : limit;
}

function _refine(props, searchState, nextRefinement, context) {
  var id = getId(props); // Setting the value to an empty string ensures that it is persisted in
  // the URL as an empty value.
  // This is necessary in the case where `defaultRefinement` contains one
  // item and we try to deselect it. `nextSelected` would be an empty array,
  // which would not be persisted to the URL.
  // {foo: ['bar']} => "foo[0]=bar"
  // {foo: []} => ""

  var nextValue = (0, _defineProperty2.default)({}, id, nextRefinement.length > 0 ? nextRefinement : '');
  var resetPage = true;
  return (0, _indexUtils.refineValue)(searchState, nextValue, context, resetPage, namespace);
}

function _cleanUp(props, searchState, context) {
  return (0, _indexUtils.cleanUpValue)(searchState, context, "".concat(namespace, ".").concat(getId(props)));
}
/**
 * connectRefinementList connector provides the logic to build a widget that will
 * give the user the ability to choose multiple values for a specific facet.
 * @name connectRefinementList
 * @kind connector
 * @requirements The attribute passed to the `attribute` prop must be present in "attributes for faceting"
 * on the Algolia dashboard or configured as `attributesForFaceting` via a set settings call to the Algolia API.
 * @propType {string} attribute - the name of the attribute in the record
 * @propType {boolean} [searchable=false] - allow search inside values
 * @propType {string} [operator=or] - How to apply the refinements. Possible values: 'or' or 'and'.
 * @propType {boolean} [showMore=false] - true if the component should display a button that will expand the number of items
 * @propType {number} [limit=10] - the minimum number of displayed items
 * @propType {number} [showMoreLimit=20] - the maximun number of displayed items. Only used when showMore is set to `true`
 * @propType {string[]} defaultRefinement - the values of the items selected by default. The searchState of this widget takes the form of a list of `string`s, which correspond to the values of all selected refinements. However, when there are no refinements selected, the value of the searchState is an empty string.
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @providedPropType {function} refine - a function to toggle a refinement
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {string[]} currentRefinement - the refinement currently applied
 * @providedPropType {array.<{count: number, isRefined: boolean, label: string, value: string}>} items - the list of items the RefinementList can display.
 * @providedPropType {function} searchForItems - a function to toggle a search inside items values
 * @providedPropType {boolean} isFromSearch - a boolean that says if the `items` props contains facet values from the global search or from the search inside items.
 * @providedPropType {boolean} canRefine - a boolean that says whether you can refine
 */


var sortBy = ['isRefined', 'count:desc', 'name:asc'];

var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaRefinementList',
  propTypes: {
    id: _propTypes.default.string,
    attribute: _propTypes.default.string.isRequired,
    operator: _propTypes.default.oneOf(['and', 'or']),
    showMore: _propTypes.default.bool,
    limit: _propTypes.default.number,
    showMoreLimit: _propTypes.default.number,
    defaultRefinement: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])),
    searchable: _propTypes.default.bool,
    transformItems: _propTypes.default.func
  },
  defaultProps: {
    operator: 'or',
    showMore: false,
    limit: 10,
    showMoreLimit: 20
  },
  getProvidedProps: function getProvidedProps(props, searchState, searchResults, metadata, searchForFacetValuesResults) {
    var _this = this;

    var attribute = props.attribute,
        searchable = props.searchable;
    var results = (0, _indexUtils.getResults)(searchResults, this.context);
    var canRefine = Boolean(results) && Boolean(results.getFacetByName(attribute));
    var isFromSearch = Boolean(searchForFacetValuesResults && searchForFacetValuesResults[attribute] && searchForFacetValuesResults.query !== ''); // Search For Facet Values is not available with derived helper (used for multi index search)

    if (searchable && this.context.multiIndexContext) {
      throw new Error('react-instantsearch: searching in *List is not available when used inside a' + ' multi index context');
    }

    if (!canRefine) {
      return {
        items: [],
        currentRefinement: getCurrentRefinement(props, searchState, this.context),
        canRefine: canRefine,
        isFromSearch: isFromSearch,
        searchable: searchable
      };
    }

    var items = isFromSearch ? searchForFacetValuesResults[attribute].map(function (v) {
      return {
        label: v.value,
        value: getValue(v.value, props, searchState, _this.context),
        _highlightResult: {
          label: {
            value: v.highlighted
          }
        },
        count: v.count,
        isRefined: v.isRefined
      };
    }) : results.getFacetValues(attribute, {
      sortBy: sortBy
    }).map(function (v) {
      return {
        label: v.name,
        value: getValue(v.name, props, searchState, _this.context),
        count: v.count,
        isRefined: v.isRefined
      };
    });
    var transformedItems = props.transformItems ? props.transformItems(items) : items;
    return {
      items: transformedItems.slice(0, getLimit(props)),
      currentRefinement: getCurrentRefinement(props, searchState, this.context),
      isFromSearch: isFromSearch,
      searchable: searchable,
      canRefine: transformedItems.length > 0
    };
  },
  refine: function refine(props, searchState, nextRefinement) {
    return _refine(props, searchState, nextRefinement, this.context);
  },
  searchForFacetValues: function searchForFacetValues(props, searchState, nextRefinement) {
    return {
      facetName: props.attribute,
      query: nextRefinement,
      maxFacetHits: getLimit(props)
    };
  },
  cleanUp: function cleanUp(props, searchState) {
    return _cleanUp(props, searchState, this.context);
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    var attribute = props.attribute,
        operator = props.operator;
    var addKey = operator === 'and' ? 'addFacet' : 'addDisjunctiveFacet';
    var addRefinementKey = "".concat(addKey, "Refinement");
    searchParameters = searchParameters.setQueryParameters({
      maxValuesPerFacet: Math.max(searchParameters.maxValuesPerFacet || 0, getLimit(props))
    });
    searchParameters = searchParameters[addKey](attribute);
    return getCurrentRefinement(props, searchState, this.context).reduce(function (res, val) {
      return res[addRefinementKey](attribute, val);
    }, searchParameters);
  },
  getMetadata: function getMetadata(props, searchState) {
    var id = getId(props);
    var context = this.context;
    return {
      id: id,
      index: (0, _indexUtils.getIndexId)(this.context),
      items: getCurrentRefinement(props, searchState, context).length > 0 ? [{
        attribute: props.attribute,
        label: "".concat(props.attribute, ": "),
        currentRefinement: getCurrentRefinement(props, searchState, context),
        value: function value(nextState) {
          return _refine(props, nextState, [], context);
        },
        items: getCurrentRefinement(props, searchState, context).map(function (item) {
          return {
            label: "".concat(item),
            value: function value(nextState) {
              var nextSelectedItems = getCurrentRefinement(props, nextState, context).filter(function (other) {
                return other !== item;
              });
              return _refine(props, searchState, nextSelectedItems, context);
            }
          };
        })
      }] : []
    };
  }
});

exports.default = _default;