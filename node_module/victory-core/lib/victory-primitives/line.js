Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactFastCompare = require("react-fast-compare");

var _reactFastCompare2 = _interopRequireDefault(_reactFastCompare);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Line = function (_React$Component) {
  _inherits(Line, _React$Component);

  function Line() {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, (Line.__proto__ || Object.getPrototypeOf(Line)).apply(this, arguments));
  }

  _createClass(Line, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return !(0, _reactFastCompare2.default)(this.props, nextProps);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          x1 = _props.x1,
          x2 = _props.x2,
          y1 = _props.y1,
          y2 = _props.y2,
          events = _props.events,
          className = _props.className,
          clipPath = _props.clipPath,
          transform = _props.transform,
          style = _props.style,
          shapeRendering = _props.shapeRendering,
          role = _props.role;

      return _react2.default.createElement("line", _extends({
        x1: x1, x2: x2, y1: y1, y2: y2,
        className: className,
        clipPath: clipPath,
        transform: transform,
        style: style,
        role: role || "presentation",
        shapeRendering: shapeRendering || "auto",
        vectorEffect: "non-scaling-stroke"
      }, events));
    }
  }]);

  return Line;
}(_react2.default.Component);

Line.propTypes = {
  className: _propTypes2.default.string,
  clipPath: _propTypes2.default.string,
  events: _propTypes2.default.object,
  role: _propTypes2.default.string,
  shapeRendering: _propTypes2.default.string,
  style: _propTypes2.default.object,
  transform: _propTypes2.default.string,
  x1: _propTypes2.default.number,
  x2: _propTypes2.default.number,
  y1: _propTypes2.default.number,
  y2: _propTypes2.default.number
};
exports.default = Line;