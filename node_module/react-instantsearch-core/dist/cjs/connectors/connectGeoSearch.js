"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _createConnector = _interopRequireDefault(require("../core/createConnector"));

var _indexUtils = require("../core/indexUtils");

/**
 * The GeoSearch connector provides the logic to build a widget that will display the results on a map.
 * It also provides a way to search for results based on their position. The connector provides function to manage the search experience (search on map interaction).
 * @name connectGeoSearch
 * @kind connector
 * @requirements Note that the GeoSearch connector uses the [geosearch](https://www.algolia.com/doc/guides/searching/geo-search) capabilities of Algolia.
 * Your hits **must** have a `_geoloc` attribute in order to be passed to the rendering function. Currently, the feature is not compatible with multiple values in the `_geoloc` attribute
 * (e.g. a restaurant with multiple locations). In that case you can duplicate your records and use the [distinct](https://www.algolia.com/doc/guides/ranking/distinct) feature of Algolia to only retrieve unique results.
 * @propType {{ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } }} [defaultRefinement] - Default search state of the widget containing the bounds for the map
 * @providedPropType {function({ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } })} refine - a function to toggle the refinement
 * @providedPropType {function} createURL - a function to generate a URL for the corresponding search state
 * @providedPropType {array.<object>} hits - the records that matched the search
 * @providedPropType {boolean} isRefinedWithMap - true if the current refinement is set with the map bounds
 * @providedPropType {{ northEast: { lat: number, lng: number }, southWest: { lat: number, lng: number } }} [currentRefinement] - the refinement currently applied
 * @providedPropType {{ lat: number, lng: number }} [position] - the position of the search
 */
// To control the map with an external widget the other widget
// **must** write the value in the attribute `aroundLatLng`
var getBoundingBoxId = function getBoundingBoxId() {
  return 'boundingBox';
};

var getAroundLatLngId = function getAroundLatLngId() {
  return 'aroundLatLng';
};

var getConfigureAroundLatLngId = function getConfigureAroundLatLngId() {
  return 'configure.aroundLatLng';
};

var currentRefinementToString = function currentRefinementToString(currentRefinement) {
  return [currentRefinement.northEast.lat, currentRefinement.northEast.lng, currentRefinement.southWest.lat, currentRefinement.southWest.lng].join();
};

var stringToCurrentRefinement = function stringToCurrentRefinement(value) {
  var values = value.split(',');
  return {
    northEast: {
      lat: parseFloat(values[0]),
      lng: parseFloat(values[1])
    },
    southWest: {
      lat: parseFloat(values[2]),
      lng: parseFloat(values[3])
    }
  };
};

var latLngRegExp = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/;

var stringToPosition = function stringToPosition(value) {
  var pattern = value.match(latLngRegExp);
  return {
    lat: parseFloat(pattern[1]),
    lng: parseFloat(pattern[2])
  };
};

var getCurrentRefinement = function getCurrentRefinement(props, searchState, context) {
  var refinement = (0, _indexUtils.getCurrentRefinementValue)(props, searchState, context, getBoundingBoxId(), {});

  if ((0, _isEmpty2.default)(refinement)) {
    return;
  } // eslint-disable-next-line consistent-return


  return {
    northEast: {
      lat: parseFloat(refinement.northEast.lat),
      lng: parseFloat(refinement.northEast.lng)
    },
    southWest: {
      lat: parseFloat(refinement.southWest.lat),
      lng: parseFloat(refinement.southWest.lng)
    }
  };
};

var getCurrentPosition = function getCurrentPosition(props, searchState, context) {
  var defaultRefinement = props.defaultRefinement,
      propsWithoutDefaultRefinement = (0, _objectWithoutProperties2.default)(props, ["defaultRefinement"]);
  var aroundLatLng = (0, _indexUtils.getCurrentRefinementValue)(propsWithoutDefaultRefinement, searchState, context, getAroundLatLngId());

  if (!aroundLatLng) {
    // Fallback on `configure.aroundLatLng`
    var configureAroundLatLng = (0, _indexUtils.getCurrentRefinementValue)(propsWithoutDefaultRefinement, searchState, context, getConfigureAroundLatLngId());
    return configureAroundLatLng && stringToPosition(configureAroundLatLng);
  }

  return aroundLatLng;
};

var _refine = function refine(searchState, nextValue, context) {
  var resetPage = true;
  var nextRefinement = (0, _defineProperty2.default)({}, getBoundingBoxId(), nextValue);
  return (0, _indexUtils.refineValue)(searchState, nextRefinement, context, resetPage);
};

var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaGeoSearch',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var results = (0, _indexUtils.getResults)(searchResults, this.context); // We read it from both because the SearchParameters & the searchState are not always
    // in sync. When we set the refinement the searchState is used but when we clear the refinement
    // the SearchParameters is used. In the first case when we render, the results are not there
    // so we can't find the value from the results. The most up to date value is the searchState.
    // But when we clear the refinement the searchState is immediatly cleared even when the items
    // retrieved are still the one from the previous query with the bounding box. It leads to some
    // issue with the position of the map. We should rely on 1 source of truth or at least always
    // be sync.

    var currentRefinementFromSearchState = getCurrentRefinement(props, searchState, this.context);
    var currentRefinementFromSearchParameters = results && results._state.insideBoundingBox && stringToCurrentRefinement(results._state.insideBoundingBox) || undefined;
    var currentPositionFromSearchState = getCurrentPosition(props, searchState, this.context);
    var currentPositionFromSearchParameters = results && results._state.aroundLatLng && stringToPosition(results._state.aroundLatLng) || undefined;
    var currentRefinement = currentRefinementFromSearchState || currentRefinementFromSearchParameters;
    var position = currentPositionFromSearchState || currentPositionFromSearchParameters;
    return {
      hits: !results ? [] : results.hits.filter(function (_) {
        return Boolean(_._geoloc);
      }),
      isRefinedWithMap: Boolean(currentRefinement),
      currentRefinement: currentRefinement,
      position: position
    };
  },
  refine: function refine(props, searchState, nextValue) {
    return _refine(searchState, nextValue, this.context);
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    var currentRefinement = getCurrentRefinement(props, searchState, this.context);

    if (!currentRefinement) {
      return searchParameters;
    }

    return searchParameters.setQueryParameter('insideBoundingBox', currentRefinementToString(currentRefinement));
  },
  cleanUp: function cleanUp(props, searchState) {
    return (0, _indexUtils.cleanUpValue)(searchState, this.context, getBoundingBoxId());
  },
  getMetadata: function getMetadata(props, searchState) {
    var _this = this;

    var items = [];
    var id = getBoundingBoxId();
    var index = (0, _indexUtils.getIndexId)(this.context);
    var nextRefinement = {};
    var currentRefinement = getCurrentRefinement(props, searchState, this.context);

    if (currentRefinement) {
      items.push({
        label: "".concat(id, ": ").concat(currentRefinementToString(currentRefinement)),
        value: function value(nextState) {
          return _refine(nextState, nextRefinement, _this.context);
        },
        currentRefinement: currentRefinement
      });
    }

    return {
      id: id,
      index: index,
      items: items
    };
  },
  shouldComponentUpdate: function shouldComponentUpdate() {
    return true;
  }
});

exports.default = _default;