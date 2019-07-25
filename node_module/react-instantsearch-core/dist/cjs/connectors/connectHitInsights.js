"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _createConnector = _interopRequireDefault(require("../core/createConnector"));

var _indexUtils = require("../core/indexUtils");

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
    aa(method, (0, _objectSpread2.default)({}, inferredPayload, payload));
  };
};

var _default = function _default(insightsClient) {
  return (0, _createConnector.default)({
    displayName: 'AlgoliaInsights',
    getProvidedProps: function getProvidedProps(props, _, searchResults) {
      var results = (0, _indexUtils.getResults)(searchResults, this.context);
      var insights = wrapInsightsClient(insightsClient, results, props.hit);
      return {
        insights: insights
      };
    }
  });
};

exports.default = _default;