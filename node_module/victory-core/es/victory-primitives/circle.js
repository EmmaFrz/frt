var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";

var Circle = function (_React$Component) {
  _inherits(Circle, _React$Component);

  function Circle() {
    _classCallCheck(this, Circle);

    return _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).apply(this, arguments));
  }

  _createClass(Circle, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return !isEqual(this.props, nextProps);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          cx = _props.cx,
          cy = _props.cy,
          r = _props.r,
          events = _props.events,
          className = _props.className,
          style = _props.style,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          transform = _props.transform,
          clipPath = _props.clipPath;

      return React.createElement("circle", _extends({
        cx: cx, cy: cy, r: r,
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

  return Circle;
}(React.Component);

Circle.propTypes = {
  className: PropTypes.string,
  clipPath: PropTypes.string,
  cx: PropTypes.number,
  cy: PropTypes.number,
  events: PropTypes.object,
  r: PropTypes.number,
  role: PropTypes.string,
  shapeRendering: PropTypes.string,
  style: PropTypes.object,
  transform: PropTypes.string
};
export default Circle;