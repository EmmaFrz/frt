var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import { addEvents, Helpers, Data, PropTypes as CustomPropTypes, Slice, VictoryContainer, VictoryLabel, VictoryTheme } from "victory-core";
import { getBaseProps } from "./helper-methods";

var fallbackProps = {
  endAngle: 360,
  height: 400,
  innerRadius: 0,
  cornerRadius: 0,
  padAngle: 0,
  padding: 30,
  width: 400,
  startAngle: 0,
  colorScale: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"]
};

var animationWhitelist = ["data", "endAngle", "height", "innerRadius", "cornerRadius", "padAngle", "padding", "colorScale", "startAngle", "style", "width"];

var VictoryPie = function (_React$Component) {
  _inherits(VictoryPie, _React$Component);

  function VictoryPie() {
    _classCallCheck(this, VictoryPie);

    return _possibleConstructorReturn(this, (VictoryPie.__proto__ || Object.getPrototypeOf(VictoryPie)).apply(this, arguments));
  }

  _createClass(VictoryPie, [{
    key: "shouldAnimate",


    // Overridden in victory-native
    value: function shouldAnimate() {
      return Boolean(this.props.animate);
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

  return VictoryPie;
}(React.Component);

VictoryPie.displayName = "VictoryPie";
VictoryPie.role = "pie";
VictoryPie.defaultTransitions = {
  onExit: {
    duration: 500,
    before: function () {
      return { _y: 0, label: " " };
    }
  },
  onEnter: {
    duration: 500,
    before: function () {
      return { _y: 0, label: " " };
    },
    after: function (datum) {
      return { y_: datum._y, label: datum.label };
    }
  }
};
VictoryPie.propTypes = {
  animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  colorScale: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.oneOf(["grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue"])]),
  containerComponent: PropTypes.element,
  cornerRadius: CustomPropTypes.nonNegative,
  data: PropTypes.array,
  dataComponent: PropTypes.element,
  endAngle: PropTypes.number,
  eventKey: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
  events: PropTypes.arrayOf(PropTypes.shape({
    target: PropTypes.oneOf(["data", "labels", "parent"]),
    eventKey: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
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
  height: CustomPropTypes.nonNegative,
  innerRadius: CustomPropTypes.nonNegative,
  labelComponent: PropTypes.element,
  labelRadius: PropTypes.oneOfType([CustomPropTypes.nonNegative, PropTypes.func]),
  labels: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
  name: PropTypes.string,
  origin: PropTypes.shape({
    x: CustomPropTypes.nonNegative,
    y: CustomPropTypes.nonNegative
  }),
  padAngle: CustomPropTypes.nonNegative,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    top: PropTypes.number, bottom: PropTypes.number,
    left: PropTypes.number, right: PropTypes.number
  })]),
  radius: CustomPropTypes.nonNegative,
  sharedEvents: PropTypes.shape({
    events: PropTypes.array,
    getEventState: PropTypes.func
  }),
  sortKey: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  sortOrder: PropTypes.oneOf(["ascending", "descending"]),
  standalone: PropTypes.bool,
  startAngle: PropTypes.number,
  style: PropTypes.shape({
    parent: PropTypes.object, data: PropTypes.object, labels: PropTypes.object
  }),
  theme: PropTypes.object,
  width: CustomPropTypes.nonNegative,
  x: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  y: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
};
VictoryPie.defaultProps = {
  data: [{ x: "A", y: 1 }, { x: "B", y: 2 }, { x: "C", y: 3 }, { x: "D", y: 1 }, { x: "E", y: 2 }],
  standalone: true,
  dataComponent: React.createElement(Slice, null),
  labelComponent: React.createElement(VictoryLabel, null),
  containerComponent: React.createElement(VictoryContainer, null),
  groupComponent: React.createElement("g", null),
  sortOrder: "ascending",
  theme: VictoryTheme.grayscale
};

VictoryPie.getBaseProps = function (props) {
  return getBaseProps(props, fallbackProps);
};

VictoryPie.getData = Data.getData;
VictoryPie.expectedComponents = ["dataComponent", "labelComponent", "groupComponent", "containerComponent"];


export default addEvents(VictoryPie);