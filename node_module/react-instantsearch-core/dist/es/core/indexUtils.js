import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread";
import _omit from "lodash/omit";
export function getIndexId(context) {
  return context && context.multiIndexContext ? context.multiIndexContext.targetedIndex : context.ais.mainTargetedIndex;
}
export function getResults(searchResults, context) {
  if (searchResults.results && !searchResults.results.hits) {
    return searchResults.results[getIndexId(context)] ? searchResults.results[getIndexId(context)] : null;
  } else {
    return searchResults.results ? searchResults.results : null;
  }
}
export function hasMultipleIndices(context) {
  return context && context.multiIndexContext;
} // eslint-disable-next-line max-params

export function refineValue(searchState, nextRefinement, context, resetPage, namespace) {
  if (hasMultipleIndices(context)) {
    var indexId = getIndexId(context);
    return namespace ? refineMultiIndexWithNamespace(searchState, nextRefinement, indexId, resetPage, namespace) : refineMultiIndex(searchState, nextRefinement, indexId, resetPage);
  } else {
    // When we have a multi index page with shared widgets we should also
    // reset their page to 1 if the resetPage is provided. Otherwise the
    // indices will always be reset
    // see: https://github.com/algolia/react-instantsearch/issues/310
    // see: https://github.com/algolia/react-instantsearch/issues/637
    if (searchState.indices && resetPage) {
      Object.keys(searchState.indices).forEach(function (targetedIndex) {
        searchState = refineValue(searchState, {
          page: 1
        }, {
          multiIndexContext: {
            targetedIndex: targetedIndex
          }
        }, true, namespace);
      });
    }

    return namespace ? refineSingleIndexWithNamespace(searchState, nextRefinement, resetPage, namespace) : refineSingleIndex(searchState, nextRefinement, resetPage);
  }
}

function refineMultiIndex(searchState, nextRefinement, indexId, resetPage) {
  var page = resetPage ? {
    page: 1
  } : undefined;
  var state = searchState.indices && searchState.indices[indexId] ? _objectSpread({}, searchState.indices, _defineProperty({}, indexId, _objectSpread({}, searchState.indices[indexId], nextRefinement, page))) : _objectSpread({}, searchState.indices, _defineProperty({}, indexId, _objectSpread({}, nextRefinement, page)));
  return _objectSpread({}, searchState, {
    indices: state
  });
}

function refineSingleIndex(searchState, nextRefinement, resetPage) {
  var page = resetPage ? {
    page: 1
  } : undefined;
  return _objectSpread({}, searchState, nextRefinement, page);
} // eslint-disable-next-line max-params


function refineMultiIndexWithNamespace(searchState, nextRefinement, indexId, resetPage, namespace) {
  var _objectSpread4;

  var page = resetPage ? {
    page: 1
  } : undefined;
  var state = searchState.indices && searchState.indices[indexId] ? _objectSpread({}, searchState.indices, _defineProperty({}, indexId, _objectSpread({}, searchState.indices[indexId], (_objectSpread4 = {}, _defineProperty(_objectSpread4, namespace, _objectSpread({}, searchState.indices[indexId][namespace], nextRefinement)), _defineProperty(_objectSpread4, "page", 1), _objectSpread4)))) : _objectSpread({}, searchState.indices, _defineProperty({}, indexId, _objectSpread(_defineProperty({}, namespace, nextRefinement), page)));
  return _objectSpread({}, searchState, {
    indices: state
  });
}

function refineSingleIndexWithNamespace(searchState, nextRefinement, resetPage, namespace) {
  var page = resetPage ? {
    page: 1
  } : undefined;
  return _objectSpread({}, searchState, _defineProperty({}, namespace, _objectSpread({}, searchState[namespace], nextRefinement)), page);
}

function getNamespaceAndAttributeName(id) {
  var parts = id.match(/^([^.]*)\.(.*)/);
  var namespace = parts && parts[1];
  var attributeName = parts && parts[2];
  return {
    namespace: namespace,
    attributeName: attributeName
  };
}

function hasRefinements(_ref) {
  var multiIndex = _ref.multiIndex,
      indexId = _ref.indexId,
      namespace = _ref.namespace,
      attributeName = _ref.attributeName,
      id = _ref.id,
      searchState = _ref.searchState;

  if (multiIndex && namespace) {
    return searchState.indices && searchState.indices[indexId] && searchState.indices[indexId][namespace] && searchState.indices[indexId][namespace].hasOwnProperty(attributeName);
  }

  if (multiIndex) {
    return searchState.indices && searchState.indices[indexId] && searchState.indices[indexId].hasOwnProperty(id);
  }

  if (namespace) {
    return searchState[namespace] && searchState[namespace].hasOwnProperty(attributeName);
  }

  return searchState.hasOwnProperty(id);
}

function getRefinements(_ref2) {
  var multiIndex = _ref2.multiIndex,
      indexId = _ref2.indexId,
      namespace = _ref2.namespace,
      attributeName = _ref2.attributeName,
      id = _ref2.id,
      searchState = _ref2.searchState;

  if (multiIndex && namespace) {
    return searchState.indices[indexId][namespace][attributeName];
  }

  if (multiIndex) {
    return searchState.indices[indexId][id];
  }

  if (namespace) {
    return searchState[namespace][attributeName];
  }

  return searchState[id];
}

export function getCurrentRefinementValue(props, searchState, context, id, defaultValue) {
  var indexId = getIndexId(context);

  var _getNamespaceAndAttri = getNamespaceAndAttributeName(id),
      namespace = _getNamespaceAndAttri.namespace,
      attributeName = _getNamespaceAndAttri.attributeName;

  var multiIndex = hasMultipleIndices(context);
  var args = {
    multiIndex: multiIndex,
    indexId: indexId,
    namespace: namespace,
    attributeName: attributeName,
    id: id,
    searchState: searchState
  };
  var hasRefinementsValue = hasRefinements(args);

  if (hasRefinementsValue) {
    return getRefinements(args);
  }

  if (props.defaultRefinement) {
    return props.defaultRefinement;
  }

  return defaultValue;
}
export function cleanUpValue(searchState, context, id) {
  var indexId = getIndexId(context);

  var _getNamespaceAndAttri2 = getNamespaceAndAttributeName(id),
      namespace = _getNamespaceAndAttri2.namespace,
      attributeName = _getNamespaceAndAttri2.attributeName;

  if (hasMultipleIndices(context) && Boolean(searchState.indices)) {
    return cleanUpValueWithMutliIndex({
      attribute: attributeName,
      searchState: searchState,
      indexId: indexId,
      id: id,
      namespace: namespace
    });
  }

  return cleanUpValueWithSingleIndex({
    attribute: attributeName,
    searchState: searchState,
    id: id,
    namespace: namespace
  });
}

function cleanUpValueWithSingleIndex(_ref3) {
  var searchState = _ref3.searchState,
      id = _ref3.id,
      namespace = _ref3.namespace,
      attribute = _ref3.attribute;

  if (namespace) {
    return _objectSpread({}, searchState, _defineProperty({}, namespace, _omit(searchState[namespace], attribute)));
  }

  return _omit(searchState, id);
}

function cleanUpValueWithMutliIndex(_ref4) {
  var searchState = _ref4.searchState,
      indexId = _ref4.indexId,
      id = _ref4.id,
      namespace = _ref4.namespace,
      attribute = _ref4.attribute;
  var indexSearchState = searchState.indices[indexId];

  if (namespace && indexSearchState) {
    return _objectSpread({}, searchState, {
      indices: _objectSpread({}, searchState.indices, _defineProperty({}, indexId, _objectSpread({}, indexSearchState, _defineProperty({}, namespace, _omit(indexSearchState[namespace], attribute)))))
    });
  }

  return _omit(searchState, "indices.".concat(indexId, ".").concat(id));
}