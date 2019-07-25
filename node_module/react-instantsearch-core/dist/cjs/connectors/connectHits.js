"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createConnector = _interopRequireDefault(require("../core/createConnector"));

var _indexUtils = require("../core/indexUtils");

var _utils = require("../core/utils");

/**
 * connectHits connector provides the logic to create connected
 * components that will render the results retrieved from
 * Algolia.
 *
 * To configure the number of hits retrieved, use [HitsPerPage widget](widgets/HitsPerPage.html),
 * [connectHitsPerPage connector](connectors/connectHitsPerPage.html) or pass the hitsPerPage
 * prop to a [Configure](guide/Search_parameters.html) widget.
 *
 * **Warning:** you will need to use the **objectID** property available on every hit as a key
 * when iterating over them. This will ensure you have the best possible UI experience
 * especially on slow networks.
 * @name connectHits
 * @kind connector
 * @providedPropType {array.<object>} hits - the records that matched the search state
 * @example
 * import React from 'react';
 * import { InstantSearch, Highlight, connectHits } from 'react-instantsearch-dom';
 *
 * const CustomHits = connectHits(({ hits }) => (
 *   <div>
 *     {hits.map(hit =>
 *       <p key={hit.objectID}>
 *         <Highlight attribute="name" hit={hit} />
 *       </p>
 *     )}
 *   </div>
 * ));
 *
 * const App = () => (
 *   <InstantSearch
 *     appId="latency"
 *     apiKey="6be0576ff61c053d5f9a3225e2a90f76"
 *     indexName="instant_search"
 *   >
 *     <CustomHits />
 *   </InstantSearch>
 * );
 */
var _default = (0, _createConnector.default)({
  displayName: 'AlgoliaHits',
  getProvidedProps: function getProvidedProps(props, searchState, searchResults) {
    var results = (0, _indexUtils.getResults)(searchResults, this.context);

    if (!results) {
      return {
        hits: []
      };
    }

    var hitsWithPositions = (0, _utils.addAbsolutePositions)(results.hits, results.hitsPerPage, results.page);
    var hitsWithPositionsAndQueryID = (0, _utils.addQueryID)(hitsWithPositions, results.queryID);
    return {
      hits: hitsWithPositionsAndQueryID
    };
  },

  /* Hits needs to be considered as a widget to trigger a search if no others widgets are used.
   * To be considered as a widget you need either getSearchParameters, getMetadata or getTransitionState
   * See createConnector.js
   * */
  getSearchParameters: function getSearchParameters(searchParameters) {
    return searchParameters;
  }
});

exports.default = _default;