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

      var props = _victoryCore.Helpers.modifyProps(this.props, fallbackProps, role);
      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }
      var children = this.renderData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryBar;
}(_react2.default.Component);

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
VictoryBar.propTypes = _extends({}, _commonProps.BaseProps, _commonProps.DataProps, {
  alignment: _propTypes2.default.oneOf(["start", "middle", "end"]),
  barRatio: _propTypes2.default.number,
  cornerRadius: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func, _propTypes2.default.shape({
    top: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func]),
    bottom: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.func])
  })]),
  horizontal: _propTypes2.default.bool
});
VictoryBar.defaultProps = {
  containerComponent: _react2.default.createElement(_victoryCore.VictoryContainer, null),
  data: defaultData,
  dataComponent: _react2.default.createElement(_victoryCore.Bar, null),
  groupComponent: _react2.default.createElement("g", { role: "presentation" }),
  labelComponent: _react2.default.createElement(_victoryCore.VictoryLabel, null),
  samples: 50,
  scale: "linear",
  sortOrder: "ascending",
  standalone: true,
  theme: _victoryCore.VictoryTheme.grayscale
};
VictoryBar.getDomain = _victoryCore.Domain.getDomainWithZero;
VictoryBar.getData = _victoryCore.Data.getData;

VictoryBar.getBaseProps = function (props) {
  return (0, _helperMethods.getBaseProps)(props, fallbackProps);
};

VictoryBar.expectedComponents = ["dataComponent", "labelComponent", "groupComponent", "containerComponent"];
exports.default = (0, _victoryCore.addEvents)(VictoryBar);