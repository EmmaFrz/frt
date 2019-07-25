import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import PropTypes from 'prop-types';
import createConnector from '../core/createConnector';
import { cleanUpValue, refineValue, getCurrentRefinementValue, getIndexId } from '../core/indexUtils';

function getId() {
  return 'query';
}

function getCurrentRefinement(props, searchState, context) {
  var id = getId(props);
  var currentRefinement = getCurrentRefinementValue(props, searchState, context, id, '');

  if (currentRefinement) {
    return currentRefinement;
  }

  return '';
}

function _refine(props, searchState, nextRefinement, context) {
  var id = getId();

  var nextValue = _defineProperty({}, id, nextRefinement);

  var resetPage = true;
  return refineValue(searchState, nextValue, context, resetPage);
}

function _cleanUp(props, searchState, context) {
  return cleanUpValue(searchState, context, getId());
}
/**
 * connectSearchBox connector provides the logic to build a widget that will
 * let the user search for a query
 * @name connectSearchBox
 * @kind connector
 * @propType {string} [defaultRefinement] - Provide a default value for the query
 * @providedPropType {function} refine - a function to change the current query
 * @providedPropType {string} currentRefinement - the current query used
 * @providedPropType {boolean} isSearchStalled - a flag that indicates if InstantSearch has detected that searches are stalled
 */


export default createConnector({
  displayName: 'AlgoliaSearchBox',
  propTypes: {
    defaultRefinement: PropTypes.string
  },
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    return {
      currentRefinement: getCurrentRefinement(props, searchState, this.context),
      isSearchStalled: searchResults.isSearchStalled
    };
  },
  refine: function refine(props, searchState, nextRefinement) {
    return _refine(props, searchState, nextRefinement, this.context);
  },
  cleanUp: function cleanUp(props, searchState) {
    return _cleanUp(props, searchState, this.context);
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQuery(getCurrentRefinement(props, searchState, this.context));
  },
  getMetadata: function getMetadata(props, searchState) {
    var _this = this;

    var id = getId(props);
    var currentRefinement = getCurrentRefinement(props, searchState, this.context);
    return {
      id: id,
      index: getIndexId(this.context),
      items: currentRefinement === null ? [] : [{
        label: "".concat(id, ": ").concat(currentRefinement),
        value: function value(nextState) {
          return _refine(props, nextState, '', _this.context);
        },
        currentRefinement: currentRefinement
      }]
    };
  }
});