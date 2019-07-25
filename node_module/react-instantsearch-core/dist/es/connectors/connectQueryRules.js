import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import createConnector from '../core/createConnector';
import { getResults, getIndexId, hasMultipleIndices } from '../core/indexUtils';

// A context rule must consist only of alphanumeric characters, hyphens, and underscores.
// See https://www.algolia.com/doc/guides/managing-results/refine-results/merchandising-and-promoting/in-depth/implementing-query-rules/#context
function escapeRuleContext(ruleName) {
  return ruleName.replace(/[^a-z0-9-_]+/gi, '_');
}

function getWidgetRefinements(attribute, widgetKey, searchState) {
  var widgetState = searchState[widgetKey];

  switch (widgetKey) {
    case 'range':
      return Object.keys(widgetState[attribute]).map(function (rangeKey) {
        return widgetState[attribute][rangeKey];
      });

    case 'refinementList':
      return widgetState[attribute];

    case 'hierarchicalMenu':
      return [widgetState[attribute]];

    case 'menu':
      return [widgetState[attribute]];

    case 'multiRange':
      return widgetState[attribute].split(':');

    case 'toggle':
      return [widgetState[attribute]];

    default:
      return [];
  }
}

function getRefinements(attribute) {
  var searchState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var refinements = Object.keys(searchState).filter(function (widgetKey) {
    return searchState[widgetKey] !== undefined && searchState[widgetKey][attribute] !== undefined;
  }).map(function (widgetKey) {
    return getWidgetRefinements(attribute, widgetKey, searchState);
  }).reduce(function (acc, current) {
    return acc.concat(current);
  }, []); // flatten the refinements

  return refinements;
}

function getRuleContextsFromTrackedFilters(_ref) {
  var searchState = _ref.searchState,
      trackedFilters = _ref.trackedFilters;
  var ruleContexts = Object.keys(trackedFilters).reduce(function (facets, facetName) {
    var facetRefinements = getRefinements(facetName, searchState);
    var getTrackedFacetValues = trackedFilters[facetName];
    var trackedFacetValues = getTrackedFacetValues(facetRefinements);
    return [].concat(_toConsumableArray(facets), _toConsumableArray(facetRefinements.filter(function (facetRefinement) {
      return trackedFacetValues.includes(facetRefinement);
    }).map(function (facetValue) {
      return escapeRuleContext("ais-".concat(facetName, "-").concat(facetValue));
    })));
  }, []);
  return ruleContexts;
}

export default createConnector({
  displayName: 'AlgoliaQueryRules',
  defaultProps: {
    transformItems: function transformItems(items) {
      return items;
    },
    transformRuleContexts: function transformRuleContexts(ruleContexts) {
      return ruleContexts;
    },
    trackedFilters: {}
  },
  getProvidedProps: function getProvidedProps(props, _1, searchResults) {
    var results = getResults(searchResults, this.context);

    if (results === null) {
      return {
        items: [],
        canRefine: false
      };
    }

    var _results$userData = results.userData,
        userData = _results$userData === void 0 ? [] : _results$userData;
    var transformItems = props.transformItems;
    var transformedItems = transformItems(userData);
    return {
      items: transformedItems,
      canRefine: transformedItems.length > 0
    };
  },
  getSearchParameters: function getSearchParameters(searchParameters, props, searchState) {
    if (Object.keys(props.trackedFilters).length === 0) {
      return searchParameters;
    }

    var indexSearchState = hasMultipleIndices(this.context) ? searchState.indices[getIndexId(this.context)] : searchState;
    var newRuleContexts = getRuleContextsFromTrackedFilters({
      searchState: indexSearchState,
      trackedFilters: props.trackedFilters
    });
    var initialRuleContexts = searchParameters.ruleContexts || [];
    var nextRuleContexts = [].concat(_toConsumableArray(initialRuleContexts), _toConsumableArray(newRuleContexts));

    if (process.env.NODE_ENV === 'development') {
      if (nextRuleContexts.length > 10) {
        // tslint:disable-next-line:no-console
        console.warn("The maximum number of `ruleContexts` is 10. They have been sliced to that limit.\nConsider using `transformRuleContexts` to minimize the number of rules sent to Algolia.");
      }
    }

    var ruleContexts = props.transformRuleContexts(nextRuleContexts).slice(0, 10);
    return searchParameters.setQueryParameter('ruleContexts', ruleContexts);
  }
});