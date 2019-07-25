var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import React from "react";
import { getBaseProps } from "./helper-methods";
import { Helpers, VictoryLabel, VictoryContainer, VictoryTheme, Bar, addEvents, Data, Domain } from "victory-core";
import { BaseProps, DataProps } from "../../helpers/common-props";

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

var defaultData = [{ x: 1, y: 1 }, { x: 2, y: 2 }, { x: 3, y: 3 }, { x: 4, y: 4 }];

var animationWhitelist = ["data", "domain", "height", "padding", "style", "width"];

var VictoryBar = function (_React$Component) {
  _inherits(VictoryBar, _React$Component);

  function VictoryBar() {
    _classCallCheck(this, VictoryBar);

    return _possibleConstructorReturn(this, (VictoryBar.__proto__ || Object.getPrototypeOf(VictoryBar)).apply(this, arguments));
  }

  _createClass(VictoryBar, [{
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

  return VictoryBar;
}(React.Component);

VictoryBar.displayName = "VictoryBar";
VictoryBar.role = "bar";
VictoryBar.defaultTransitions = {
  onLoad: {
    duration: 2000,
    before: function () {
      return { _y: 0, _y1: 0, _y0: 0 };
    },
    after: function (datum) {
      return { _y: datum._y, _y1: datum._y1, _y0: datum._y0 };
    }
  },
  onExit: {
    duration: 500,
    before: function () {
      return { _y: 0, yOffset: 0 };
    }
  },
  onEnter: {
    duration: 500,
    before: function () {
      return { _y: 0, _y1: 0, _y0: 0 };
    },
    after: function (datum) {
      return { _y: datum._y, _y1: datum._y1, _y0: datum._y0 };
    }
  }
};
VictoryBar.propTypes = _extends({}, BaseProps, DataProps, {
  alignment: PropTypes.oneOf(["start", "middle", "end"]),
  barRatio: PropTypes.number,
  cornerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.func, PropTypes.shape({
    top: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
  })]),
  horizontal: PropTypes.bool
});
VictoryBar.defaultProps = {
  containerComponent: React.createElement(VictoryContainer, null),
  data: defaultData,
  dataComponent: React.createElement(Bar, null),
  groupComponent: React.createElement("g", { role: "presentation" }),
  labelComponent: React.createElement(VictoryLabel, null),
  samples: 50,
  scale: "linear",
  sortOrder: "ascending",
  standalone: true,
  theme: VictoryTheme.grayscale
};
VictoryBar.getDomain = Domain.getDomainWithZero;
VictoryBar.getData = Data.getData;

VictoryBar.getBaseProps = function (props) {
  return getBaseProps(props, fallbackProps);
};

VictoryBar.expectedComponents = ["dataComponent", "labelComponent", "groupComponent", "containerComponent"];


export default addEvents(VictoryBar);