"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _createConnector = _interopRequireDefault(require("../core/createConnector"));

var _indexUtils = require("../core/indexUtils");

function getId() {
  return 'sortBy';
}

function getCurrentRefinement(props, searchState, context) {
  var id = getId(props);
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, id, null);

  if (currentRefinement) {
    return currentRefinement;
  }

  return null;
}
/**
 * The connectSortBy connector provides the logic to build a widget that will
 *  display a list of indices. This allows a user to change how the hits are being sorted.
 * @name connectSortBy
 * @requirements Algolia handles sorting by creating replica indices. [Read more about sorting](https://www.algolia.com/doc/guides/relevance/sorting/) on
 * the Algolia website.
 * @kind connector
 * @propType {string} defaultRefinement - The default selected index.
 * @propType {{value: string, label: string}[]} items - The list of indexes to search in.
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @providedPropType {function} refine - a function to remove a single filter
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {string[]} currentRefinement - the refinement currently applied
 * @providedPropType {array.<{isRefined: boolean, label?: string, value: string}>} items - the list of items the HitsPerPage can display.  If no label provided, the value will be displayed.
 */


var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaSortBy',
  propTypes: {
    defaultRefinement: _propTypes.default.string,
    items: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.string.isRequired
    })).isRequired,
    transformItems: _propTypes.default.func
  },
  getProvidedProps: function getProvidedProps(props, searchState) {
    var currentRefinement = getCurrentRefinement(props, searchState, this.context);
    var items = props.items.map(function (item) {
      return item.value === currentRefinement ? (0, _objectSpread2.default)({}, item, {
        isRefined: true
      }) : (0, _objectSpread2.default)({}, item, {
        isRefined: false
      });
    });
    return {
      items: props.transformItems ? props.transformItems(items) : items,
      currentRefinement: currentRefinement
    };
  },
  refine: function refine(props, searchState, nextRefinement) {
    var id = getId();
    var nextValue = (0, _defineProperty2.default)({}, id, nextRefinement);
    var resetPage = true;
    return (0, _indexUtils.refineValue)(searchState, nextValue, this.context, resetPage);
  },
  cleanUp: function cleanUp(props, searchState) {
    return (0, _indexUtils.cleanUpValue)(searchState, this.context, getId());
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    var selectedIndex = getCurrentRefinement(props, searchState, this.context);
    return searchParameters.setIndex(selectedIndex);
  },
  getMetadata: function getMetadata() {
    return {
      id: getId()
    };
  }
});

exports.default = _default;