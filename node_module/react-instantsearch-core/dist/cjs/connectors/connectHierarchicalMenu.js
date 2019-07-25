"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.getId = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _algoliasearchHelper = _interopRequireDefault(require("algoliasearch-helper"));

var _createConnector = _interopRequireDefault(require("../core/createConnector"));

var _indexUtils = require("../core/indexUtils");

var getId = function getId(props) {
  return props.attributes[0];
};

exports.getId = getId;
var namespace = 'hierarchicalMenu';

function getCurrentRefinement(props, searchState, context) {
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, "".concat(namespace, ".").concat(getId(props)), null);

  if (currentRefinement === '') {
    return null;
  }

  return currentRefinement;
}

function getValue(path, props, searchState, context) {
  var id = props.id,
      attributes = props.attributes,
      separator = props.separator,
      rootPath = props.rootPath,
      showParentLevel = props.showParentLevel;
  var currentRefinement = getCurrentRefinement(props, searchState, context);
  var nextRefinement;

  if (currentRefinement === null) {
    nextRefinement = path;
  } else {
    var tmpSearchParameters = new _algoliasearchHelper.default.SearchParameters({
      hierarchicalFacets: [{
        name: id,
        attributes: attributes,
        separator: separator,
        rootPath: rootPath,
        showParentLevel: showParentLevel
      }]
    });
    nextRefinement = tmpSearchParameters.toggleHierarchicalFacetRefinement(id, currentRefinement).toggleHierarchicalFacetRefinement(id, path).getHierarchicalRefinement(id)[0];
  }

  return nextRefinement;
}

function transformValue(value, props, searchState, context) {
  return value.map(function (v) {
    return {
      label: v.name,
      value: getValue(v.path, props, searchState, context),
      count: v.count,
      isRefined: v.isRefined,
      items: v.data && transformValue(v.data, props, searchState, context)
    };
  });
}

var truncate = function truncate() {
  var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  return items.slice(0, limit).map(function () {
    var item = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return Array.isArray(item.items) ? (0, _objectSpread2.default)({}, item, {
      items: truncate(item.items, limit)
    }) : item;
  });
};

function _refine(props, searchState, nextRefinement, context) {
  var id = getId(props);
  var nextValue = (0, _defineProperty2.default)({}, id, nextRefinement || '');
  var resetPage = true;
  return (0, _indexUtils.refineValue)(searchState, nextValue, context, resetPage, namespace);
}

function _cleanUp(props, searchState, context) {
  return (0, _indexUtils.cleanUpValue)(searchState, context, "".concat(namespace, ".").concat(getId(props)));
}

var sortBy = ['name:asc'];
/**
 * connectHierarchicalMenu connector provides the logic to build a widget that will
 * give the user the ability to explore a tree-like structure.
 * This is commonly used for multi-level categorization of products on e-commerce
 * websites. From a UX point of view, we suggest not displaying more than two levels deep.
 * @name connectHierarchicalMenu
 * @requirements To use this widget, your attributes must be formatted in a specific way.
 * If you want for example to have a hiearchical menu of categories, objects in your index
 * should be formatted this way:
 *
 * ```json
 * {
 *   "categories.lvl0": "products",
 *   "categories.lvl1": "products > fruits",
 *   "categories.lvl2": "products > fruits > citrus"
 * }
 * ```
 *
 * It's also possible to provide more than one path for each level:
 *
 * ```json
 * {
 *   "categories.lvl0": ["products", "goods"],
 *   "categories.lvl1": ["products > fruits", "goods > to eat"]
 * }
 * ```
 *
 * All attributes passed to the `attributes` prop must be present in "attributes for faceting"
 * on the Algolia dashboard or configured as `attributesForFaceting` via a set settings call to the Algolia API.
 *
 * @kind connector
 * @propType {array.<string>} attributes - List of attributes to use to generate the hierarchy of the menu. See the example for the convention to follow.
 * @propType {string} [defaultRefinement] - the item value selected by default
 * @propType {boolean} [showMore=false] - Flag to activate the show more button, for toggling the number of items between limit and showMoreLimit.
 * @propType {number} [limit=10] -  The maximum number of items displayed.
 * @propType {number} [showMoreLimit=20] -  The maximum number of items displayed when the user triggers the show more. Not considered if `showMore` is false.
 * @propType {string} [separator='>'] -  Specifies the level separator used in the data.
 * @propType {string} [rootPath=null] - The path to use if the first level is not the root level.
 * @propType {boolean} [showParentLevel=true] - Flag to set if the parent level should be displayed.
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @providedPropType {function} refine - a function to toggle a refinement
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {string} currentRefinement - the refinement currently applied
 * @providedPropType {array.<{items: object, count: number, isRefined: boolean, label: string, value: string}>} items - the list of items the HierarchicalMenu can display. items has the same shape as parent items.
 */

var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaHierarchicalMenu',
  propTypes: {
    attributes: function attributes(props, propName, componentName) {
      var isNotString = function isNotString(val) {
        return typeof val !== 'string';
      };

      if (!Array.isArray(props[propName]) || props[propName].some(isNotString) || props[propName].length < 1) {
        return new Error("Invalid prop ".concat(propName, " supplied to ").concat(componentName, ". Expected an Array of Strings"));
      }

      return undefined;
    },
    separator: _propTypes.default.string,
    rootPath: _propTypes.default.string,
    showParentLevel: _propTypes.default.bool,
    defaultRefinement: _propTypes.default.string,
    showMore: _propTypes.default.bool,
    limit: _propTypes.default.number,
    showMoreLimit: _propTypes.default.number,
    transformItems: _propTypes.default.func
  },
  defaultProps: {
    showMore: false,
    limit: 10,
    showMoreLimit: 20,
    separator: ' > ',
    rootPath: null,
    showParentLevel: true
  },
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var showMore = props.showMore,
        limit = props.limit,
        showMoreLimit = props.showMoreLimit;
    var id = getId(props);
    var results = (0, _indexUtils.getResults)(searchResults, this.context);
    var isFacetPresent = Boolean(results) && Boolean(results.getFacetByName(id));

    if (!isFacetPresent) {
      return {
        items: [],
        currentRefinement: getCurrentRefinement(props, searchState, this.context),
        canRefine: false
      };
    }

    var itemsLimit = showMore ? showMoreLimit : limit;
    var value = results.getFacetValues(id, {
      sortBy: sortBy
    });
    var items = value.data ? transformValue(value.data, props, searchState, this.context) : [];
    var transformedItems = props.transformItems ? props.transformItems(items) : items;
    return {
      items: truncate(transformedItems, itemsLimit),
      currentRefinement: getCurrentRefinement(props, searchState, this.context),
      canRefine: transformedItems.length > 0
    };
  },
  refine: function refine(props, searchState, nextRefinement) {
    return _refine(props, searchState, nextRefinement, this.context);
  },
  cleanUp: function cleanUp(props, searchState) {
    return _cleanUp(props, searchState, this.context);
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    var attributes = props.attributes,
        separator = props.separator,
        rootPath = props.rootPath,
        showParentLevel = props.showParentLevel,
        showMore = props.showMore,
        limit = props.limit,
        showMoreLimit = props.showMoreLimit;
    var id = getId(props);
    var itemsLimit = showMore ? showMoreLimit : limit;
    searchParameters = searchParameters.addHierarchicalFacet({
      name: id,
      attributes: attributes,
      separator: separator,
      rootPath: rootPath,
      showParentLevel: showParentLevel
    }).setQueryParameters({
      maxValuesPerFacet: Math.max(searchParameters.maxValuesPerFacet || 0, itemsLimit)
    });
    var currentRefinement = getCurrentRefinement(props, searchState, this.context);

    if (currentRefinement !== null) {
      searchParameters = searchParameters.toggleHierarchicalFacetRefinement(id, currentRefinement);
    }

    return searchParameters;
  },
  getMetadata: function getMetadata(props, searchState) {
    var _this = this;

    var rootAttribute = props.attributes[0];
    var id = getId(props);
    var currentRefinement = getCurrentRefinement(props, searchState, this.context);
    return {
      id: id,
      index: (0, _indexUtils.getIndexId)(this.context),
      items: !currentRefinement ? [] : [{
        label: "".concat(rootAttribute, ": ").concat(currentRefinement),
        attribute: rootAttribute,
        value: function value(nextState) {
          return _refine(props, nextState, '', _this.context);
        },
        currentRefinement: currentRefinement
      }]
    };
  }
});

exports.default = _default;