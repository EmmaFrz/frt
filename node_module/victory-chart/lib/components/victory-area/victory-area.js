Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _helperMethods = require("./helper-methods");

var _victoryCore = require("victory-core");

var _commonProps = require("../../helpers/common-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  interpolation: "linear"
};

var options = {
  components: [{ name: "parent", index: "parent" }, { name: "data", index: "all" }, { name: "labels" }]
};

var animationWhitelist = ["data", "domain", "height", "padding", "style", "width"];

var VictoryArea = function (_React$Component) {
  _inherits(VictoryArea, _React$Component);

  function VictoryArea() {
    _classCallCheck(this, VictoryArea);

    return _possibleConstructorReturn(this, (VictoryArea.__proto__ || Object.getPrototypeOf(VictoryArea)).apply(this, arguments));
  }

  _createClass(VictoryArea, [{
    key: "shouldAnimate",


    // Overridden in native versions
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var role = this.constructor.role;

      var props = _victoryCore.Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }
      var children = this.renderContinuousData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryArea;
}(_react2.default.Component);

VictoryArea.propTypes = _extends({}, _commonProps.BaseProps, _commonProps.DataProps, {
  interpolation: _propTypes2.default.oneOf(["basis", "cardinal", "catmullRom", "linear", "monotoneX", "monotoneY", "natural", "step", "stepAfter", "stepBefore"]),
  label: _victoryCore.PropTypes.deprecated(_propTypes2.default.string, "Use `labels` instead for individual data labels")
});
VictoryArea.defaultProps = {
  containerComponent: _react2.default.createElement(_victoryCore.VictoryContainer, null),
  dataComponent: _react2.default.createElement(_victoryCore.Area, null),
  groupComponent: _react2.default.createElement(_victoryCore.VictoryClipContainer, null),
  labelComponent: _react2.default.createElement(_victoryCore.VictoryLabel, { renderInPortal: true }),
  samples: 50,
  scale: "linear",
  sortKey: "x",
  sortOrder: "ascending",
  standalone: true,
  theme: _victoryCore.VictoryTheme.grayscale
};
VictoryArea.displayName = "VictoryArea";
VictoryArea.role = "area";
VictoryArea.continuous = true;
VictoryArea.defaultTransitions = _victoryCore.DefaultTransitions.continuousTransitions();
VictoryArea.defaultPolarTransitions = _victoryCore.DefaultTransitions.continuousPolarTransitions();
VictoryArea.getDomain = _victoryCore.Domain.getDomainWithZero;
VictoryArea.getData = _victoryCore.Data.getData;

VictoryArea.getBaseProps = function (props) {
  return (0, _helperMethods.getBaseProps)(props, fallbackProps);
};

VictoryArea.expectedComponents = ["dataComponent", "labelComponent", "groupComponent", "containerComponent"];
exports.default = (0, _victoryCore.addEvents)(VictoryArea, options);