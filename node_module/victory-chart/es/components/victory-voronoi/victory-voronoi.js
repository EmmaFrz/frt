var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents, VictoryContainer, VictoryTheme, DefaultTransitions, Voronoi, Data, Domain } from "victory-core";
import { getBaseProps } from "./helper-methods";
import { BaseProps, DataProps } from "../../helpers/common-props";

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

var animationWhitelist = ["data", "domain", "height", "padding", "samples", "size", "style", "width"];

var VictoryVoronoi = function (_React$Component) {
  _inherits(VictoryVoronoi, _React$Component);

  function VictoryVoronoi() {
    _classCallCheck(this, VictoryVoronoi);

    return _possibleConstructorReturn(this, (VictoryVoronoi.__proto__ || Object.getPrototypeOf(VictoryVoronoi)).apply(this, arguments));
  }

  _createClass(VictoryVoronoi, [{
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

  return VictoryVoronoi;
}(React.Component);

VictoryVoronoi.displayName = "VictoryVoronoi";
VictoryVoronoi.role = "voronoi";
VictoryVoronoi.defaultTransitions = DefaultTransitions.discreteTransitions();
VictoryVoronoi.propTypes = _extends({}, BaseProps, DataProps, {
  size: CustomPropTypes.nonNegative
});
VictoryVoronoi.defaultProps = {
  containerComponent: React.createElement(VictoryContainer, null),
  dataComponent: React.createElement(Voronoi, null),
  labelComponent: React.createElement(VictoryLabel, null),
  groupComponent: React.createElement("g", { role: "presentation" }),
  samples: 50,
  scale: "linear",
  sortOrder: "ascending",
  standalone: true,
  theme: VictoryTheme.grayscale
};
VictoryVoronoi.getDomain = Domain.getDomain;
VictoryVoronoi.getData = Data.getData;

VictoryVoronoi.getBaseProps = function (props) {
  return getBaseProps(props, fallbackProps);
};

VictoryVoronoi.expectedComponents = ["dataComponent", "labelComponent", "groupComponent", "containerComponent"];


export default addEvents(VictoryVoronoi);