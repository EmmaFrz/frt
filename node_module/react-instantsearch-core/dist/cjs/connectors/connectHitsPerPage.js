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
  return 'hitsPerPage';
}

function getCurrentRefinement(props, searchState, context) {
  var id = getId();
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, id, null);

  if (typeof currentRefinement === 'string') {
    return parseInt(currentRefinement, 10);
  }

  return currentRefinement;
}
/**
 * connectHitsPerPage connector provides the logic to create connected
 * components that will allow a user to choose to display more or less results from Algolia.
 * @name connectHitsPerPage
 * @kind connector
 * @propType {number} defaultRefinement - The number of items selected by default
 * @propType {{value: number, label: string}[]} items - List of hits per page options.
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @providedPropType {function} refine - a function to remove a single filter
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {string} currentRefinement - the refinement currently applied
 * @providedPropType {array.<{isRefined: boolean, label?: string, value: number}>} items - the list of items the HitsPerPage can display. If no label provided, the value will be displayed.
 */


var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaHitsPerPage',
  propTypes: {
    defaultRefinement: _propTypes.default.number.isRequired,
    items: _propTypes.default.arrayOf(_propTypes.default.shape({
      label: _propTypes.default.string,
      value: _propTypes.default.number.isRequired
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
    return searchParameters.setHitsPerPage(getCurrentRefinement(props, searchState, this.context));
  },
  getMetadata: function getMetadata() {
    return {
      id: getId()
    };
  }
});

exports.default = _default;