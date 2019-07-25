var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import React from "react";
import { getBaseProps } from "./helper-methods";
import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents, VictoryContainer, VictoryTheme, DefaultTransitions, Curve, VictoryClipContainer, Data, Domain } from "victory-core";
import { BaseProps, DataProps } from "../../helpers/common-props";

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  interpolation: "linear"
};

var options = {
  components: [{ name: "parent", index: "parent" }, { name: "data", index: "all" }, { name: "labels" }]
};

var animationWhitelist = ["data", "domain", "height", "padding", "samples", "style", "width"];

var VictoryLine = function (_React$Component) {
  _inherits(VictoryLine, _React$Component);

  function VictoryLine() {
    _classCallCheck(this, VictoryLine);

    return _possibleConstructorReturn(this, (VictoryLine.__proto__ || Object.getPrototypeOf(VictoryLine)).apply(this, arguments));
  }

  _createClass(VictoryLine, [{
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
      var children = this.renderContinuousData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryLine;
}(React.Component);

VictoryLine.displayName = "VictoryLine";
VictoryLine.role = "line";
VictoryLine.defaultTransitions = DefaultTransitions.continuousTransitions();
VictoryLine.defaultPolarTransitions = DefaultTransitions.continuousPolarTransitions();
VictoryLine.continuous = true;
VictoryLine.propTypes = _extends({}, BaseProps, DataProps, {
  interpolation: PropTypes.oneOf(["basis", "bundle", "cardinal", "catmullRom", "linear", "monotoneX", "monotoneY", "natural", "step", "stepAfter", "stepBefore"]),
  label: CustomPropTypes.deprecated(PropTypes.string, "Use `labels` instead for individual data labels")
});
VictoryLine.defaultProps = {
  containerComponent: React.createElement(VictoryContainer, null),
  dataComponent: React.createElement(Curve, null),
  labelComponent: React.createElement(VictoryLabel, { renderInPortal: true }),
  groupComponent: React.createElement(VictoryClipContainer, null),
  samples: 50,
  scale: "linear",
  sortKey: "x",
  sortOrder: "ascending",
  standalone: true,
  theme: VictoryTheme.grayscale
};
VictoryLine.getDomain = Domain.getDomain;
VictoryLine.getData = Data.getData;

VictoryLine.getBaseProps = function (props) {
  return getBaseProps(props, fallbackProps);
};

VictoryLine.expectedComponents = ["dataComponent", "labelComponent", "groupComponent", "containerComponent"];

export default addEvents(VictoryLine, options);