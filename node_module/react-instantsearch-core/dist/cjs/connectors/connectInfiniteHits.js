"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _createConnector = _interopRequireDefault(require("../core/createConnector"));

var _indexUtils = require("../core/indexUtils");

var _utils = require("../core/utils");

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
/**
 * InfiniteHits connector provides the logic to create connected
 * components that will render an continuous list of results retrieved from
 * Algolia. This connector provides a function to load more results.
 * @name connectInfiniteHits
 * @kind connector
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @providedPropType {boolean} hasMore - indicates if there are more pages to load
 * @providedPropType {function} refine - call to load more results
 */


var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaInfiniteHits',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var _this = this;

    var results = (0, _indexUtils.getResults)(searchResults, this.context);
    this._allResults = this._allResults || [];
    this._prevState = this._prevState || {};

    if (!results) {
      return {
        hits: [],
        hasPrevious: false,
        hasMore: false,
        refine: function refine() {},
        refinePrevious: function refinePrevious() {},
        refineNext: function refineNext() {}
      };
    }

    var page = results.page,
        hits = results.hits,
        hitsPerPage = results.hitsPerPage,
        nbPages = results.nbPages,
        _results$_state = results._state;
    _results$_state = _results$_state === void 0 ? {} : _results$_state;
    var p = _results$_state.page,
        currentState = (0, _objectWithoutProperties2.default)(_results$_state, ["page"]);
    var hitsWithPositions = (0, _utils.addAbsolutePositions)(hits, hitsPerPage, page);
    var hitsWithPositionsAndQueryID = (0, _utils.addQueryID)(hitsWithPositions, results.queryID);

    if (this._firstReceivedPage === undefined || !(0, _isEqual2.default)(currentState, this._prevState)) {
      this._allResults = (0, _toConsumableArray2.default)(hitsWithPositionsAndQueryID);
      this._firstReceivedPage = page;
      this._lastReceivedPage = page;
    } else if (this._lastReceivedPage < page) {
      this._allResults = [].concat((0, _toConsumableArray2.default)(this._allResults), (0, _toConsumableArray2.default)(hitsWithPositionsAndQueryID));
      this._lastReceivedPage = page;
    } else if (this._firstReceivedPage > page) {
      this._allResults = [].concat((0, _toConsumableArray2.default)(hitsWithPositionsAndQueryID), (0, _toConsumableArray2.default)(this._allResults));
      this._firstReceivedPage = page;
    }

    this._prevState = currentState;
    var hasPrevious = this._firstReceivedPage > 0;
    var lastPageIndex = nbPages - 1;
    var hasMore = page < lastPageIndex;

    var refinePrevious = function refinePrevious(event) {
      return _this.refine(event, _this._firstReceivedPage - 1);
    };

    var refineNext = function refineNext(event) {
      return _this.refine(event, _this._lastReceivedPage + 1);
    };

    return {
      hits: this._allResults,
      hasPrevious: hasPrevious,
      hasMore: hasMore,
      refinePrevious: refinePrevious,
      refineNext: refineNext
    };
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    return searchParameters.setQueryParameters({
      page: getCurrentRefinement(props, searchState, this.context) - 1
    });
  },
  refine: function refine(props, searchState, event, index) {
    if (index === undefined && this._lastReceivedPage !== undefined) {
      index = this._lastReceivedPage + 1;
    } else if (index === undefined) {
      index = getCurrentRefinement(props, searchState, this.context);
    }

    var id = getId();
    var nextValue = (0, _defineProperty2.default)({}, id, index + 1); // `index` is indexed from 0 but page number is indexed from 1

    var resetPage = false;
    return (0, _indexUtils.refineValue)(searchState, nextValue, this.context, resetPage);
  }
});

exports.default = _default;