var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import { getBaseProps, getDimensions } from "./helper-methods";
import CustomPropTypes from "../victory-util/prop-types";
import addEvents from "../victory-util/add-events";
import Helpers from "../victory-util/helpers";
import VictoryLabel from "../victory-label/victory-label";
import VictoryContainer from "../victory-container/victory-container";
import VictoryTheme from "../victory-theme/victory-theme";
import Point from "../victory-primitives/point";
import Border from "../victory-primitives/border";

var fallbackProps = {
  orientation: "vertical",
  titleOrientation: "top",
  width: 450,
  height: 300,
  x: 0,
  y: 0
};

var defaultLegendData = [{ name: "Series 1" }, { name: "Series 2" }];

var VictoryLegend = function (_React$Component) {
  _inherits(VictoryLegend, _React$Component);

  function VictoryLegend() {
    _classCallCheck(this, VictoryLegend);

    return _possibleConstructorReturn(this, (VictoryLegend.__proto__ || Object.getPrototypeOf(VictoryLegend)).apply(this, arguments));
  }

  _createClass(VictoryLegend, [{
    key: "renderChildren",
    value: function renderChildren(props) {
      var _this2 = this;

      var dataComponent = props.dataComponent,
          labelComponent = props.labelComponent,
          title = props.title;

      var dataComponents = this.dataKeys.map(function (_dataKey, index) {
        var dataProps = _this2.getComponentProps(dataComponent, "data", index);
        return React.cloneElement(dataComponent, dataProps);
      });

      var labelComponents = this.dataKeys.map(function (_dataKey, index) {
        var labelProps = _this2.getComponentProps(labelComponent, "labels", index);
        if (labelProps.text !== undefined && labelProps.text !== null) {
          return React.cloneElement(labelComponent, labelProps);
        }
        return undefined;
      }).filter(Boolean);

      var borderProps = this.getComponentProps(props.borderComponent, "border", 0);
      var borderComponent = React.cloneElement(props.borderComponent, borderProps);
      if (title) {
        var titleProps = this.getComponentProps(props.title, "title", 0);
        var titleComponent = React.cloneElement(props.titleComponent, titleProps);
        return [borderComponent].concat(_toConsumableArray(dataComponents), [titleComponent], _toConsumableArray(labelComponents));
      }
      return [borderComponent].concat(_toConsumableArray(dataComponents), _toConsumableArray(labelComponents));
    }
  }, {
    key: "render",
    value: function render() {
      var role = this.constructor.role;

      var props = Helpers.modifyProps(this.props, fallbackProps, role);
      var children = [this.renderChildren(props)];
      return props.standalone ? this.renderContainer(props.containerComponent, children) : React.cloneElement(props.groupComponent, {}, children);
    }
  }]);

  return VictoryLegend;
}(React.Component);

VictoryLegend.displayName = "VictoryLegend";
VictoryLegend.role = "legend";
VictoryLegend.propTypes = {
  borderComponent: PropTypes.element,
  borderPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number
  })]),
  centerTitle: PropTypes.bool,
  colorScale: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.oneOf(["grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue"])]),
  containerComponent: PropTypes.element,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.object,
    symbol: PropTypes.object
  })),
  dataComponent: PropTypes.element,
  eventKey: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
  events: PropTypes.arrayOf(PropTypes.shape({
    target: PropTypes.oneOf(["data", "labels", "parent"]),
    eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
    eventHandlers: PropTypes.object
  })),
  externalEventMutations: PropTypes.arrayOf(PropTypes.shape({
    callback: PropTypes.function,
    childName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
    mutation: PropTypes.function,
    target: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
  })),
  groupComponent: PropTypes.element,
  gutter: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    left: PropTypes.number,
    right: PropTypes.number
  })]),
  height: CustomPropTypes.nonNegative,
  itemsPerRow: CustomPropTypes.nonNegative,
  labelComponent: PropTypes.element,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number
  })]),
  rowGutter: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number
  })]),
  sharedEvents: PropTypes.shape({
    events: PropTypes.array,
    getEventState: PropTypes.func
  }),
  standalone: PropTypes.bool,
  style: PropTypes.shape({
    border: PropTypes.object,
    data: PropTypes.object,
    labels: PropTypes.object,
    parent: PropTypes.object,
    title: PropTypes.object
  }),
  symbolSpacer: PropTypes.number,
  theme: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  titleComponent: PropTypes.element,
  titleOrientation: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  width: CustomPropTypes.nonNegative,
  x: CustomPropTypes.nonNegative,
  y: CustomPropTypes.nonNegative
};
VictoryLegend.defaultProps = {
  borderComponent: React.createElement(Border, null),
  data: defaultLegendData,
  containerComponent: React.createElement(VictoryContainer, null),
  dataComponent: React.createElement(Point, null),
  groupComponent: React.createElement("g", null),
  labelComponent: React.createElement(VictoryLabel, null),
  standalone: true,
  theme: VictoryTheme.grayscale,
  titleComponent: React.createElement(VictoryLabel, null)
};

VictoryLegend.getBaseProps = function (props) {
  return getBaseProps(props, fallbackProps);
};

VictoryLegend.getDimensions = function (props) {
  return getDimensions(props, fallbackProps);
};

VictoryLegend.expectedComponents = ["borderComponent", "containerComponent", "dataComponent", "groupComponent", "labelComponent", "titleComponent"];


export default addEvents(VictoryLegend);