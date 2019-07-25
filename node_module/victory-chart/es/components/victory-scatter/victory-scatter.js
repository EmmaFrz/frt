var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import React from "react";
import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents, VictoryContainer, VictoryTheme, DefaultTransitions, Point, Data, Domain } from "victory-core";
import { getBaseProps } from "./helper-methods";
import { BaseProps, DataProps } from "../../helpers/common-props";

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  size: 3,
  symbol: "circle"
};

var animationWhitelist = ["data", "domain", "height", "maxBubbleSize", "padding", "samples", "size", "style", "width"];

var VictoryScatter = function (_React$Component) {
  _inherits(VictoryScatter, _React$Component);

  function VictoryScatter() {
    _classCallCheck(this, VictoryScatter);

    return _possibleConstructorReturn(this, (VictoryScatter.__proto__ || Object.getPrototypeOf(VictoryScatter)).apply(this, arguments));
  }

  _createClass(VictoryScatter, [{
    key: "shouldAnimate",


    // Overridden in native versions
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
      var children = this.renderData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryScatter;
}(React.Component);

VictoryScatter.displayName = "VictoryScatter";
VictoryScatter.role = "scatter";
VictoryScatter.defaultTransitions = DefaultTransitions.discreteTransitions();
VictoryScatter.propTypes = _extends({}, BaseProps, DataProps, {
  bubbleProperty: PropTypes.string,
  maxBubbleSize: CustomPropTypes.nonNegative,
  minBubbleSize: CustomPropTypes.nonNegative,
  size: PropTypes.oneOfType([CustomPropTypes.nonNegative, PropTypes.func]),
  symbol: PropTypes.oneOfType([PropTypes.oneOf(["circle", "diamond", "plus", "minus", "square", "star", "triangleDown", "triangleUp"]), PropTypes.func])
});
VictoryScatter.defaultProps = {
  containerComponent: React.createElement(VictoryContainer, null),
  dataComponent: React.createElement(Point, null),
  labelComponent: React.createElement(VictoryLabel, null),
  groupComponent: React.createElement("g", null),
  samples: 50,
  scale: "linear",
  sortOrder: "ascending",
  standalone: true,
  theme: VictoryTheme.grayscale
};
VictoryScatter.getDomain = Domain.getDomain;
VictoryScatter.getData = Data.getData;

VictoryScatter.getBaseProps = function (props) {
  return getBaseProps(props, fallbackProps);
};

VictoryScatter.expectedComponents = ["dataComponent", "labelComponent", "groupComponent", "containerComponent"];


export default addEvents(VictoryScatter);