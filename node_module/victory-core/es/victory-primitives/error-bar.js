import _assign from "lodash/assign";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable max-statements */
import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";

import CommonProps from "./common-props";
import Line from "./line";

var ErrorBar = function (_React$Component) {
  _inherits(ErrorBar, _React$Component);

  function ErrorBar() {
    _classCallCheck(this, ErrorBar);

    return _possibleConstructorReturn(this, (ErrorBar.__proto__ || Object.getPrototypeOf(ErrorBar)).apply(this, arguments));
  }

  _createClass(ErrorBar, [{
    key: "getStyle",
    value: function getStyle(props) {
      var style = props.style,
          datum = props.datum,
          active = props.active;

      return Helpers.evaluateStyle(_assign({ stroke: "black" }, style), datum, active);
    }
  }, {
    key: "renderBorder",
    value: function renderBorder(props, error, type) {
      var x = props.x,
          y = props.y,
          borderWidth = props.borderWidth,
          events = props.events,
          style = props.style,
          role = props.role,
          shapeRendering = props.shapeRendering,
          className = props.className,
          lineComponent = props.lineComponent,
          transform = props.transform;

      var vertical = type === "right" || type === "left";
      var borderProps = {
        role: role, shapeRendering: shapeRendering, className: className, events: events, style: style, transform: transform,
        key: "border-" + type,
        x1: vertical ? error[type] : x - borderWidth,
        x2: vertical ? error[type] : x + borderWidth,
        y1: vertical ? y - borderWidth : error[type],
        y2: vertical ? y + borderWidth : error[type]
      };
      return React.cloneElement(lineComponent, borderProps);
    }
  }, {
    key: "renderCross",
    value: function renderCross(props, error, type) {
      var x = props.x,
          y = props.y,
          events = props.events,
          style = props.style,
          role = props.role,
          shapeRendering = props.shapeRendering,
          className = props.className,
          lineComponent = props.lineComponent,
          transform = props.transform;

      var vertical = type === "top" || type === "bottom";
      var borderProps = {
        role: role, shapeRendering: shapeRendering, className: className, events: events, style: style, transform: transform,
        key: "cross-" + type,
        x1: x,
        x2: vertical ? x : error[type],
        y1: y,
        y2: vertical ? error[type] : y
      };
      return React.cloneElement(lineComponent, borderProps);
    }
  }, {
    key: "calculateError",
    value: function calculateError(props) {
      var errorX = props.errorX,
          errorY = props.errorY,
          scale = props.scale;

      var rangeX = scale.x.range();
      var rangeY = scale.y.range();
      var positiveErrorX = errorX ? errorX[0] : undefined;
      var negativeErrorX = errorX ? errorX[1] : undefined;
      var positiveErrorY = errorY ? errorY[1] : undefined;
      var negativeErrorY = errorY ? errorY[0] : undefined;

      return {
        right: positiveErrorX >= rangeX[1] ? rangeX[1] : positiveErrorX,
        left: negativeErrorX <= rangeX[0] ? rangeX[0] : negativeErrorX,
        top: positiveErrorY >= rangeY[0] ? rangeY[0] : positiveErrorY,
        bottom: negativeErrorY <= rangeY[1] ? rangeY[1] : negativeErrorY
      };
    }
  }, {
    key: "render",
    value: function render() {
      var props = _assign({}, this.props, { style: this.getStyle(this.props) });
      var error = this.calculateError(props);
      var children = [error.right ? this.renderBorder(props, error, "right") : null, error.left ? this.renderBorder(props, error, "left") : null, error.bottom ? this.renderBorder(props, error, "bottom") : null, error.top ? this.renderBorder(props, error, "top") : null, error.right ? this.renderCross(props, error, "right") : null, error.left ? this.renderCross(props, error, "left") : null, error.bottom ? this.renderCross(props, error, "bottom") : null, error.top ? this.renderCross(props, error, "top") : null].filter(Boolean);
      return React.cloneElement(props.groupComponent, {}, children);
    }
  }]);

  return ErrorBar;
}(React.Component);

ErrorBar.propTypes = _extends({}, CommonProps, {
  borderWidth: PropTypes.number,
  datum: PropTypes.object,
  errorX: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.bool]),
  errorY: PropTypes.oneOfType([PropTypes.number, PropTypes.array, PropTypes.bool]),
  groupComponent: PropTypes.element,
  lineComponent: PropTypes.element,
  x: PropTypes.number,
  y: PropTypes.number
});
ErrorBar.defaultProps = {
  groupComponent: React.createElement("g", null),
  lineComponent: React.createElement(Line, null)
};
export default ErrorBar;