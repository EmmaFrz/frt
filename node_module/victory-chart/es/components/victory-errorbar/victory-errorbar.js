var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import React from "react";
import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents, VictoryContainer, VictoryTheme, DefaultTransitions, ErrorBar } from "victory-core";
import { getBaseProps, getDomain, getData } from "./helper-methods";
import { BaseProps, DataProps } from "../../helpers/common-props";

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

var defaultData = [{ x: 1, y: 1, errorX: 0.1, errorY: 0.1 }, { x: 2, y: 2, errorX: 0.2, errorY: 0.2 }, { x: 3, y: 3, errorX: 0.3, errorY: 0.3 }, { x: 4, y: 4, errorX: 0.4, errorY: 0.4 }];

var animationWhitelist = ["data", "domain", "height", "padding", "samples", "style", "width", "errorX", "errorY", "borderWidth"];

var VictoryErrorBar = function (_React$Component) {
  _inherits(VictoryErrorBar, _React$Component);

  function VictoryErrorBar() {
    _classCallCheck(this, VictoryErrorBar);

    return _possibleConstructorReturn(this, (VictoryErrorBar.__proto__ || Object.getPrototypeOf(VictoryErrorBar)).apply(this, arguments));
  }

  _createClass(VictoryErrorBar, [{
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

  return VictoryErrorBar;
}(React.Component);

VictoryErrorBar.displayName = "VictoryErrorBar";
VictoryErrorBar.role = "errorBar";
VictoryErrorBar.defaultTransitions = DefaultTransitions.discreteTransitions();
VictoryErrorBar.propTypes = _extends({}, BaseProps, DataProps, {
  borderWidth: PropTypes.number,
  errorX: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  errorY: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  horizontal: PropTypes.bool
});
VictoryErrorBar.defaultProps = {
  containerComponent: React.createElement(VictoryContainer, null),
  data: defaultData,
  dataComponent: React.createElement(ErrorBar, null),
  labelComponent: React.createElement(VictoryLabel, null),
  groupComponent: React.createElement("g", { role: "presentation" }),
  samples: 50,
  scale: "linear",
  sortOrder: "ascending",
  standalone: true,
  theme: VictoryTheme.grayscale
};
VictoryErrorBar.getDomain = getDomain;
VictoryErrorBar.getData = getData;

VictoryErrorBar.getBaseProps = function (props) {
  return getBaseProps(props, fallbackProps);
};

VictoryErrorBar.expectedComponents = ["dataComponent", "labelComponent", "groupComponent", "containerComponent"];


export default addEvents(VictoryErrorBar);