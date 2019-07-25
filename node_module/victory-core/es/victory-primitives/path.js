var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import isEqual from "react-fast-compare";

var Path = function (_React$Component) {
  _inherits(Path, _React$Component);

  function Path() {
    _classCallCheck(this, Path);

    return _possibleConstructorReturn(this, (Path.__proto__ || Object.getPrototypeOf(Path)).apply(this, arguments));
  }

  _createClass(Path, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return !isEqual(this.props, nextProps);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          d = _props.d,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          clipPath = _props.clipPath,
          style = _props.style,
          transform = _props.transform,
          events = _props.events;

      return React.createElement("path", _extends({
        d: d,
        transform: transform,
        className: className,
        clipPath: clipPath,
        style: style,
        role: role || "presentation",
        shapeRendering: shapeRendering || "auto"
      }, events));
    }
  }]);

  return Path;
}(React.Component);

Path.propTypes = {
  className: PropTypes.string,
  clipPath: PropTypes.string,
  d: PropTypes.string,
  events: PropTypes.object,
  role: PropTypes.string,
  shapeRendering: PropTypes.string,
  style: PropTypes.object,
  transform: PropTypes.string
};
export default Path;