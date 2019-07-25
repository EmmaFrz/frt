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
import Line from "./line";

var Axis = function (_React$Component) {
  _inherits(Axis, _React$Component);

  function Axis() {
    _classCallCheck(this, Axis);

    return _possibleConstructorReturn(this, (Axis.__proto__ || Object.getPrototypeOf(Axis)).apply(this, arguments));
  }

  _createClass(Axis, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          x1 = _props.x1,
          x2 = _props.x2,
          y1 = _props.y1,
          y2 = _props.y2,
          events = _props.events,
          datum = _props.datum,
          active = _props.active,
          lineComponent = _props.lineComponent,
          className = _props.className,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          transform = _props.transform;

      var style = Helpers.evaluateStyle(_assign({ stroke: "black" }, this.props.style), datum, active);
      return React.cloneElement(lineComponent, {
        style: style, className: className, role: role, shapeRendering: shapeRendering, events: events, x1: x1, x2: x2, y1: y1, y2: y2, transform: transform
      });
    }
  }]);

  return Axis;
}(React.Component);

Axis.propTypes = _extends({}, CommonProps, {
  datum: PropTypes.any,
  lineComponent: PropTypes.element,
  x1: PropTypes.number,
  x2: PropTypes.number,
  y1: PropTypes.number,
  y2: PropTypes.number
});
Axis.defaultProps = {
  lineComponent: React.createElement(Line, null)
};
export default Axis;