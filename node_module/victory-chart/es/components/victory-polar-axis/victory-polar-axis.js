import _assign from "lodash/assign";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";

import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, VictoryContainer, VictoryTheme, Grid, addEvents, Arc } from "victory-core";
import { getScale, getStyles, getBaseProps } from "./helper-methods";
import Axis from "../../helpers/axis";
import { BaseProps } from "../../helpers/common-props";

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

var animationWhitelist = ["style", "domain", "range", "tickCount", "tickValues", "padding", "width", "height"];

var options = {
  components: [{ name: "axis", index: 0 }, { name: "axisLabel", index: 0 }, { name: "grid" }, { name: "parent", index: "parent" }, { name: "ticks" }, { name: "tickLabels" }]
};

var VictoryPolarAxis = function (_React$Component) {
  _inherits(VictoryPolarAxis, _React$Component);

  function VictoryPolarAxis() {
    _classCallCheck(this, VictoryPolarAxis);

    return _possibleConstructorReturn(this, (VictoryPolarAxis.__proto__ || Object.getPrototypeOf(VictoryPolarAxis)).apply(this, arguments));
  }

  _createClass(VictoryPolarAxis, [{
    key: "renderAxisLine",
    value: function renderAxisLine(props) {
      var dependentAxis = props.dependentAxis;

      var axisComponent = dependentAxis ? props.axisComponent : props.circularAxisComponent;
      var axisProps = this.getComponentProps(axisComponent, "axis", 0);
      return React.cloneElement(axisComponent, axisProps);
    }
  }, {
    key: "renderLabel",
    value: function renderLabel(props) {
      var axisLabelComponent = props.axisLabelComponent,
          dependentAxis = props.dependentAxis,
          label = props.label;

      if (!label || !dependentAxis) {
        return null;
      }
      var axisLabelProps = this.getComponentProps(axisLabelComponent, "axisLabel", 0);
      return React.cloneElement(axisLabelComponent, axisLabelProps);
    }
  }, {
    key: "renderAxis",
    value: function renderAxis(props) {
      var _this2 = this;

      var tickComponent = props.tickComponent,
          tickLabelComponent = props.tickLabelComponent;

      var axisType = props.dependentAxis ? "radial" : "angular";
      var gridComponent = axisType === "radial" ? props.circularGridComponent : props.gridComponent;
      var tickComponents = this.dataKeys.map(function (key, index) {
        var tickProps = _assign({ key: "tick-" + key }, _this2.getComponentProps(tickComponent, "ticks", index));
        return React.cloneElement(tickComponent, tickProps);
      });

      var gridComponents = this.dataKeys.map(function (key, index) {
        var gridProps = _assign({ key: "grid-" + key }, _this2.getComponentProps(gridComponent, "grid", index));
        return React.cloneElement(gridComponent, gridProps);
      });

      var tickLabelComponents = this.dataKeys.map(function (key, index) {
        var tickLabelProps = _assign({ key: "tick-" + key }, _this2.getComponentProps(tickLabelComponent, "tickLabels", index));
        return React.cloneElement(tickLabelComponent, tickLabelProps);
      });
      var axis = this.renderAxisLine(props);
      var axisLabel = this.renderLabel(props);
      var children = [axis, axisLabel].concat(_toConsumableArray(tickComponents), _toConsumableArray(gridComponents), _toConsumableArray(tickLabelComponents));
      return this.renderGroup(props, children);
    }

    // Overridden in victory-native

  }, {
    key: "renderGroup",
    value: function renderGroup(props, children) {
      var groupComponent = props.groupComponent;

      var groupComponentProps = groupComponent.props || {};
      var origin = Helpers.getPolarOrigin(props);
      var transform = groupComponentProps.transform || "translate(" + origin.x + ", " + origin.y + ")";
      return React.cloneElement(groupComponent, { transform: transform }, children);
    }
  }, {
    key: "shouldAnimate",
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var props = Helpers.modifyProps(this.props, fallbackProps, "axis");
      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }
      var children = this.renderAxis(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryPolarAxis;
}(React.Component);

VictoryPolarAxis.displayName = "VictoryAxis";
VictoryPolarAxis.role = "axis";
VictoryPolarAxis.defaultTransitions = {
  onExit: {
    duration: 500
  },
  onEnter: {
    duration: 500
  }
};
VictoryPolarAxis.propTypes = _extends({}, BaseProps, {
  axisAngle: PropTypes.number,
  axisComponent: PropTypes.element,
  axisLabelComponent: PropTypes.element,
  axisValue: PropTypes.number,
  categories: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape({
    x: PropTypes.arrayOf(PropTypes.string), y: PropTypes.arrayOf(PropTypes.string)
  })]),
  circularAxisComponent: PropTypes.element,
  circularGridComponent: PropTypes.element,
  containerComponent: PropTypes.element,
  dependentAxis: PropTypes.bool,
  endAngle: PropTypes.number,
  events: PropTypes.arrayOf(PropTypes.shape({
    target: PropTypes.oneOf(["axis", "axisLabel", "grid", "ticks", "tickLabels"]),
    eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
    eventHandlers: PropTypes.object
  })),
  gridComponent: PropTypes.element,
  innerRadius: CustomPropTypes.nonNegative,
  labelPlacement: PropTypes.oneOf(["parallel", "perpendicular", "vertical"]),
  startAngle: PropTypes.number,
  stringMap: PropTypes.object,
  style: PropTypes.shape({
    parent: PropTypes.object, axis: PropTypes.object, axisLabel: PropTypes.object,
    grid: PropTypes.object, ticks: PropTypes.object, tickLabels: PropTypes.object
  }),
  tickComponent: PropTypes.element,
  tickCount: CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.greaterThanZero]),
  tickFormat: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.homogeneousArray]),
  tickLabelComponent: PropTypes.element,
  tickValues: CustomPropTypes.homogeneousArray
});
VictoryPolarAxis.defaultProps = {
  axisComponent: React.createElement(Grid, { type: "axis" }),
  axisLabelComponent: React.createElement(VictoryLabel, null),
  circularAxisComponent: React.createElement(Arc, { type: "axis" }),
  circularGridComponent: React.createElement(Arc, { type: "grid" }),
  containerComponent: React.createElement(VictoryContainer, null),
  endAngle: 360,
  gridComponent: React.createElement(Grid, { type: "grid" }),
  groupComponent: React.createElement("g", { role: "presentation" }),
  labelPlacement: "parallel",
  scale: "linear",
  startAngle: 0,
  standalone: true,
  theme: VictoryTheme.grayscale,
  tickComponent: React.createElement(Grid, { type: "tick" }),
  tickLabelComponent: React.createElement(VictoryLabel, null)
};
VictoryPolarAxis.getDomain = Axis.getDomain;
VictoryPolarAxis.getAxis = Axis.getAxis;
VictoryPolarAxis.getScale = getScale;

VictoryPolarAxis.getStyles = function (props) {
  return getStyles(props, fallbackProps.style);
};

VictoryPolarAxis.getBaseProps = function (props) {
  return getBaseProps(props, fallbackProps);
};

VictoryPolarAxis.expectedComponents = ["axisComponent", "circularAxisComponent", "groupComponent", "containerComponent", "tickComponent", "tickLabelComponent", "gridComponent", "circularGridComponent"];


export default addEvents(VictoryPolarAxis, options);