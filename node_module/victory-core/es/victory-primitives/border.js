import _assign from "lodash/assign";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";

import CommonProps from "./common-props";
import Rect from "./rect";

var Border = function (_React$Component) {
  _inherits(Border, _React$Component);

  function Border() {
    _classCallCheck(this, Border);

    return _possibleConstructorReturn(this, (Border.__proto__ || Object.getPrototypeOf(Border)).apply(this, arguments));
  }

  _createClass(Border, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          x = _props.x,
          y = _props.y,
          width = _props.width,
          height = _props.height,
          events = _props.events,
          datum = _props.datum,
          active = _props.active,
          role = _props.role,
          className = _props.className,
          shapeRendering = _props.shapeRendering,
          rectComponent = _props.rectComponent,
          transform = _props.transform;

      var style = Helpers.evaluateStyle(_assign({ fill: "none" }, this.props.style), datum, active);
      return React.cloneElement(rectComponent, {
        style: style, className: className, x: x, y: y, width: width, height: height, events: events, role: role, shapeRendering: shapeRendering, transform: transform
      });
    }
  }]);

  return Border;
}(React.Component);

Border.propTypes = _extends({}, CommonProps, {
  height: PropTypes.number,
  rectComponent: PropTypes.element,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
});
Border.defaultProps = {
  rectComponent: React.createElement(Rect, null)
};
export default Border;