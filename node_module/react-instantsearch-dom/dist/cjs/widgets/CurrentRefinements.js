"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactInstantsearchCore = require("react-instantsearch-core");

var _PanelCallbackHandler = _interopRequireDefault(require("../components/PanelCallbackHandler"));

var _CurrentRefinements = _interopRequireDefault(require("../components/CurrentRefinements"));

/**
 * The CurrentRefinements widget displays the list of currently applied filters.
 *
 * It allows the user to selectively remove them.
 * @name CurrentRefinements
 * @kind widget
 * @propType {function} [transformItems] - Function to modify the items being displayed, e.g. for filtering or sorting them. Takes an items as parameter and expects it back in return.
 * @themeKey ais-CurrentRefinements - the root div of the widget
 * @themeKey ais-CurrentRefinements--noRefinement - the root div of the widget when there is no refinement
 * @themeKey ais-CurrentRefinements-list - the list of all refined items
 * @themeKey ais-CurrentRefinements-list--noRefinement - the list of all refined items when there is no refinement
 * @themeKey ais-CurrentRefinements-item - the refined list item
 * @themeKey ais-CurrentRefinements-button - the button of each refined list item
 * @themeKey ais-CurrentRefinements-label - the refined list label
 * @themeKey ais-CurrentRefinements-category - the category of each item
 * @themeKey ais-CurrentRefinements-categoryLabel - the label of each catgory
 * @themeKey ais-CurrentRefinements-delete - the delete button of each label
 * @translationKey clearFilter - the remove filter button label
 * @example
 * import React from 'react';
 * import { InstantSearch, CurrentRefinements, RefinementList } from 'react-instantsearch-dom';
 *
 * const App = () => (
 *   <InstantSearch
 *     appId="latency"
 *     apiKey="6be0576ff61c053d5f9a3225e2a90f76"
 *     indexName="instant_search"
 *   >
 *     <CurrentRefinements />
 *     <RefinementList
 *       attribute="brand"
 *       defaultRefinement={['Colors']}
 *     />
 *   </InstantSearch>
 * );
 */
var CurrentRefinementsWidget = function CurrentRefinementsWidget(props) {
  return _react.default.createElement(_PanelCallbackHandler.default, props, _react.default.createElement(_CurrentRefinements.default, props));
};

var _default = (0, _reactInstantsearchCore.connectCurrentRefinements)(CurrentRefinementsWidget);

exports.default = _default;