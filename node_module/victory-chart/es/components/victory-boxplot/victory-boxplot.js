import _flatten from "lodash/flatten";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";

import { BaseProps, DataProps } from "../../helpers/common-props";
import { Helpers, VictoryLabel, addEvents, Line, PropTypes as CustomPropTypes, VictoryContainer, VictoryTheme, Box, Whisker, DefaultTransitions } from "victory-core";
import { getDomain, getData, getBaseProps } from "./helper-methods";

var fallbackProps = {
  width: 450,
  height: 300,
  padding: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }
};

var options = {
  components: [{ name: "min" }, { name: "minLabels" }, { name: "max" }, { name: "maxLabels" }, { name: "median" }, { name: "medianLabels" }, { name: "q1" }, { name: "q1Labels" }, { name: "q3" }, { name: "q3Labels" }, { name: "parent", index: "parent" }]
};

var defaultData = [{ x: 1, min: 5, q1: 7, median: 12, q3: 18, max: 20 }, { x: 2, min: 2, q1: 5, median: 8, q3: 12, max: 15 }];

var animationWhitelist = ["data", "domain", "height", "padding", "style", "width"];

var VictoryBoxPlot = function (_React$Component) {
  _inherits(VictoryBoxPlot, _React$Component);

  function VictoryBoxPlot() {
    _classCallCheck(this, VictoryBoxPlot);

    return _possibleConstructorReturn(this, (VictoryBoxPlot.__proto__ || Object.getPrototypeOf(VictoryBoxPlot)).apply(this, arguments));
  }

  _createClass(VictoryBoxPlot, [{
    key: "renderBoxPlot",
    value: function renderBoxPlot(props) {
      var _this2 = this;

      var types = ["q1", "q3", "max", "min", "median"];
      var dataComponents = _flatten(types.map(function (type) {
        return _this2.dataKeys.map(function (key, index) {
          var baseComponent = props[type + "Component"];
          var componentProps = _this2.getComponentProps(baseComponent, type, index);
          return React.cloneElement(baseComponent, componentProps);
        });
      }));

      var labelComponents = _flatten(types.map(function (type) {
        var components = _this2.dataKeys.map(function (key, index) {
          var name = type + "Labels";
          var baseComponent = props[type + "LabelComponent"];
          var labelProps = _this2.getComponentProps(baseComponent, name, index);
          if (labelProps.text !== undefined && labelProps.text !== null) {
            return React.cloneElement(baseComponent, labelProps);
          }
          return undefined;
        });
        return components.filter(Boolean);
      }));
      var children = [].concat(_toConsumableArray(dataComponents), _toConsumableArray(labelComponents));
      return this.renderContainer(props.groupComponent, children);
    }

    // Overridden in native versions

  }, {
    key: "shouldAnimate",
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var role = this.constructor.role;

      var props = Helpers.modifyProps(this.props, fallbackProps, role);
      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }
      var children = this.renderBoxPlot(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryBoxPlot;
}(React.Component);

VictoryBoxPlot.displayName = "VictoryBoxPlot";
VictoryBoxPlot.role = "boxplot";
VictoryBoxPlot.defaultTransitions = DefaultTransitions.discreteTransitions();
VictoryBoxPlot.propTypes = _extends({}, BaseProps, DataProps, {
  boxWidth: PropTypes.number,
  events: PropTypes.arrayOf(PropTypes.shape({
    target: PropTypes.oneOf(["max", "maxLabels", "median", "medianLabels", "min", "minLabels", "q1", "q1Labels", "q3", "q3Labels", "parent"]),
    eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
    eventHandlers: PropTypes.object
  })),
  horizontal: PropTypes.bool,
  labelOrientation: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  labels: PropTypes.bool,
  max: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  maxComponent: PropTypes.element,
  maxLabelComponent: PropTypes.element,
  maxLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
  median: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  medianComponent: PropTypes.element,
  medianLabelComponent: PropTypes.element,
  medianLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
  min: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  minComponent: PropTypes.element,
  minLabelComponent: PropTypes.element,
  minLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
  q1: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  q1Component: PropTypes.element,
  q1LabelComponent: PropTypes.element,
  q1Labels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
  q3: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  q3Component: PropTypes.element,
  q3LabelComponent: PropTypes.element,
  q3Labels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
  style: PropTypes.shape({
    boxes: PropTypes.object,
    labels: PropTypes.object,
    parent: PropTypes.object,
    max: PropTypes.object,
    maxLabels: PropTypes.object,
    median: PropTypes.object,
    medianLabels: PropTypes.object,
    min: PropTypes.object,
    minLabels: PropTypes.object,
    q1: PropTypes.object,
    q1Labels: PropTypes.object,
    q3: PropTypes.object,
    q3Labels: PropTypes.object,
    whiskers: PropTypes.object
  }),
  whiskerWidth: PropTypes.number
});
VictoryBoxPlot.defaultProps = {
  containerComponent: React.createElement(VictoryContainer, null),
  data: defaultData,
  dataComponent: React.createElement(Box, null),
  groupComponent: React.createElement("g", { role: "presentation" }),
  maxComponent: React.createElement(Whisker, null),
  maxLabelComponent: React.createElement(VictoryLabel, null),
  medianComponent: React.createElement(Line, null),
  medianLabelComponent: React.createElement(VictoryLabel, null),
  minComponent: React.createElement(Whisker, null),
  minLabelComponent: React.createElement(VictoryLabel, null),
  q1Component: React.createElement(Box, null),
  q1LabelComponent: React.createElement(VictoryLabel, null),
  q3Component: React.createElement(Box, null),
  q3LabelComponent: React.createElement(VictoryLabel, null),
  samples: 50,
  scale: "linear",
  sortKey: "x",
  sortOrder: "ascending",
  standalone: true,
  theme: VictoryTheme.grayscale
};
VictoryBoxPlot.getDomain = getDomain;
VictoryBoxPlot.getData = getData;

VictoryBoxPlot.getBaseProps = function (props) {
  return getBaseProps(props, fallbackProps);
};

VictoryBoxPlot.expectedComponents = ["maxComponent", "maxLabelComponent", "medianComponent", "medianLabelComponent", "minComponent", "minLabelComponent", "q1Component", "q1LabelComponent", "q3Component", "q3LabelComponent", "groupComponent", "containerComponent"];


export default addEvents(VictoryBoxPlot, options);