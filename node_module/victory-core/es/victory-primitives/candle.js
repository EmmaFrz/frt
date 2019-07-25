import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*eslint no-magic-numbers: ["error", { "ignore": [0.5, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";

import CommonProps from "./common-props";
import Rect from "./rect";
import Line from "./line";

var Candle = function (_React$Component) {
  _inherits(Candle, _React$Component);

  function Candle() {
    _classCallCheck(this, Candle);

    return _possibleConstructorReturn(this, (Candle.__proto__ || Object.getPrototypeOf(Candle)).apply(this, arguments));
  }

  _createClass(Candle, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          x = _props.x,
          high = _props.high,
          low = _props.low,
          open = _props.open,
          close = _props.close,
          data = _props.data,
          datum = _props.datum,
          active = _props.active,
          width = _props.width,
          candleHeight = _props.candleHeight,
          events = _props.events,
          groupComponent = _props.groupComponent,
          rectComponent = _props.rectComponent,
          lineComponent = _props.lineComponent,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          wickStrokeWidth = _props.wickStrokeWidth,
          transform = _props.transform;

      var style = Helpers.evaluateStyle(_assign({ stroke: "black" }, this.props.style), datum, active);
      var wickStyle = _defaults({ strokeWidth: wickStrokeWidth }, style);
      var padding = this.props.padding.left || this.props.padding;
      var candleWidth = style.width || 0.5 * (width - 2 * padding) / data.length;
      var candleX = x - candleWidth / 2;
      var sharedProps = { role: role, shapeRendering: shapeRendering, className: className, events: events, transform: transform };

      var candleProps = _assign({
        key: "candle",
        style: style,
        x: candleX,
        y: Math.min(open, close),
        width: candleWidth,
        height: candleHeight
      }, sharedProps);

      var highWickProps = _assign({
        key: "highWick",
        style: wickStyle,
        x1: x,
        x2: x,
        y1: high,
        y2: Math.min(open, close)
      }, sharedProps);

      var lowWickProps = _assign({
        key: "lowWick",
        style: wickStyle,
        x1: x,
        x2: x,
        y1: Math.max(open, close),
        y2: low
      }, sharedProps);

      return React.cloneElement(groupComponent, {}, [React.cloneElement(rectComponent, candleProps), React.cloneElement(lineComponent, highWickProps), React.cloneElement(lineComponent, lowWickProps)]);
    }
  }]);

  return Candle;
}(React.Component);

Candle.propTypes = _extends({}, CommonProps, {
  candleHeight: PropTypes.number,
  close: PropTypes.number,
  datum: PropTypes.object,
  groupComponent: PropTypes.element,
  high: PropTypes.number,
  lineComponent: PropTypes.element,
  low: PropTypes.number,
  open: PropTypes.number,
  padding: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  rectComponent: PropTypes.element,
  wickStrokeWidth: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number
});
Candle.defaultProps = {
  groupComponent: React.createElement("g", null),
  lineComponent: React.createElement(Line, null),
  rectComponent: React.createElement(Rect, null)
};
export default Candle;