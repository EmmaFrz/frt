"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _createConnector = _interopRequireDefault(require("../core/createConnector"));

var _indexUtils = require("../core/indexUtils");

function getId() {
  return 'page';
}

function getCurrentRefinement(props, searchState, context) {
  var id = getId();
  var page = 1;
  var currentRefinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, id, page);

  if (typeof currentRefinement === 'string') {
    return parseInt(currentRefinement, 10);
  }

  return currentRefinement;
}

function _refine(props, searchState, nextPage, context) {
  var id = getId();
  var nextValue = (0, _defineProperty2.default)({}, id, nextPage);
  var resetPage = false;
  return (0, _indexUtils.refineValue)(searchState, nextValue, context, resetPage);
}
/**
 * connectPagination connector provides the logic to build a widget that will
 * let the user displays hits corresponding to a certain page.
 * @name connectPagination
 * @kind connector
 * @propType {boolean} [showFirst=true] - Display the first page link.
 * @propType {boolean} [showLast=false] - Display the last page link.
 * @propType {boolean} [showPrevious=true] - Display the previous page link.
 * @propType {boolean} [showNext=true] - Display the next page link.
 * @propType {number} [padding=3] - How many page links to display around the current page.
 * @propType {number} [totalPages=Infinity] - Maximum number of pages to display.
 * @providedPropType {function} refine - a function to remove a single filter
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {number} nbPages - the total of existing pages
 * @providedPropType {number} currentRefinement - the page refinement currently applied
 */


var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaPagination',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var results = (0, _indexUtils.getResults)(searchResults, this.context);

    if (!results) {
      return null;
    }

    var nbPages = results.nbPages;
    return {
      nbPages: nbPages,
      currentRefinement: getCurrentRefinement(props, searchState, this.context),
      canRefine: nbPages > 1
    };
  },
  refine: function refine(props, searchState, nextPage) {
    return _refine(props, searchState, nextPage, this.context);
  },
  cleanUp: function cleanUp(props, searchState) {
    return (0, _indexUtils.cleanUpValue)(searchState, this.context, getId());
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setPage(getCurrentRefinement(props, searchState, this.context) - 1);
  },
  getMetadata: function getMetadata() {
    return {
      id: getId()
    };
  }
});

exports.default = _default;