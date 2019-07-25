import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import createConnector from '../core/createConnector';
import { cleanUpValue, refineValue, getCurrentRefinementValue, getResults } from '../core/indexUtils';

function getId() {
  return 'page';
}

function getCurrentRefinement(props, searchState, context) {
  var id = getId();
  var page = 1;
  var currentRefinement = getCurrentRefinementValue(props, searchState, context, id, page);

  if (typeof currentRefinement === 'string') {
    return parseInt(currentRefinement, 10);
  }

  return currentRefinement;
}

function _refine(props, searchState, nextPage, context) {
  var id = getId();

  var nextValue = _defineProperty({}, id, nextPage);

  var resetPage = false;
  return refineValue(searchState, nextValue, context, resetPage);
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


export default createConnector({
  displayName: 'AlgoliaPagination',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var results = getResults(searchResults, this.context);

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
    return cleanUpValue(searchState, this.context, getId());
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