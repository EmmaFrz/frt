import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import createConnector from '../core/createConnector';
import { getResults } from '../core/indexUtils';

function inferPayload(_ref) {
  var method = _ref.method,
      results = _ref.results,
      currentHit = _ref.currentHit;
  var index = results.index;
  var queryID = currentHit.__queryID;
  var objectIDs = [currentHit.objectID];

  switch (method) {
    case 'clickedObjectIDsAfterSearch':
      {
        var positions = [currentHit.__position];
        return {
          index: index,
          queryID: queryID,
          objectIDs: objectIDs,
          positions: positions
        };
      }

    case 'convertedObjectIDsAfterSearch':
      return {
        index: index,
        queryID: queryID,
        objectIDs: objectIDs
      };

    default:
      throw new Error("Unsupported method \"".concat(method, "\" passed to the insights function. The supported methods are: \"clickedObjectIDsAfterSearch\", \"convertedObjectIDsAfterSearch\"."));
  }
}

var wrapInsightsClient = function wrapInsightsClient(aa, results, currentHit) {
  return function (method, payload) {
    if (typeof aa !== 'function') {
      throw new TypeError("Expected insightsClient to be a Function");
    }

    var inferredPayload = inferPayload({
      method: method,
      results: results,
      currentHit: currentHit
    });
    aa(method, _objectSpread({}, inferredPayload, payload));
  };
};

export default (function (insightsClient) {
  return createConnector({
    displayName: 'AlgoliaInsights',
    getProvidedProps: function getProvidedProps(props, _, searchResults) {
      var results = getResults(searchResults, this.context);
      var insights = wrapInsightsClient(insightsClient, results, props.hit);
      return {
        insights: insights
      };
    }
  });
});