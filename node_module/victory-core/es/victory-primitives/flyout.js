var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";
import CommonProps from "./common-props";
import Path from "./path";

var Flyout = function (_React$Component) {
  _inherits(Flyout, _React$Component);

  function Flyout() {
    _classCallCheck(this, Flyout);

    return _possibleConstructorReturn(this, (Flyout.__proto__ || Object.getPrototypeOf(Flyout)).apply(this, arguments));
  }

  _createClass(Flyout, [{
    key: "getVerticalPath",
    value: function getVerticalPath(props) {
      var pointerLength = props.pointerLength,
          pointerWidth = props.pointerWidth,
          cornerRadius = props.cornerRadius,
          orientation = props.orientation,
          width = props.width,
          height = props.height;

      var sign = orientation === "top" ? 1 : -1;
      var x = props.x + (props.dx || 0);
      var y = props.y - sign * (props.dy || 0);
      var pointerEdge = y - sign * pointerLength;
      var oppositeEdge = y - sign * pointerLength - sign * height;
      var rightEdge = x + width / 2;
      var leftEdge = x - width / 2;
      var direction = orientation === "top" ? "0 0 0" : "0 0 1";
      var arc = cornerRadius + " " + cornerRadius + " " + direction;
      return "M " + (x - pointerWidth / 2) + ", " + pointerEdge + "\n      L " + x + ", " + y + "\n      L " + (x + pointerWidth / 2) + ", " + pointerEdge + "\n      L " + (rightEdge - cornerRadius) + ", " + pointerEdge + "\n      A " + arc + " " + rightEdge + ", " + (pointerEdge - sign * cornerRadius) + "\n      L " + rightEdge + ", " + (oppositeEdge + sign * cornerRadius) + "\n      A " + arc + " " + (rightEdge - cornerRadius) + ", " + oppositeEdge + "\n      L " + (leftEdge + cornerRadius) + ", " + oppositeEdge + "\n      A " + arc + " " + leftEdge + ", " + (oppositeEdge + sign * cornerRadius) + "\n      L " + leftEdge + ", " + (pointerEdge - sign * cornerRadius) + "\n      A " + arc + " " + (leftEdge + cornerRadius) + ", " + pointerEdge + "\n      z";
    }
  }, {
    key: "getHorizontalPath",
    value: function getHorizontalPath(props) {
      var pointerLength = props.pointerLength,
          pointerWidth = props.pointerWidth,
          cornerRadius = props.cornerRadius,
          orientation = props.orientation,
          width = props.width,
          height = props.height;

      var sign = orientation === "right" ? 1 : -1;
      var x = props.x + sign * (props.dx || 0);
      var y = props.y - (props.dy || 0);
      var pointerEdge = x + sign * pointerLength;
      var oppositeEdge = x + sign * pointerLength + sign * width;
      var bottomEdge = y + height / 2;
      var topEdge = y - height / 2;
      var direction = orientation === "right" ? "0 0 0" : "0 0 1";
      var arc = cornerRadius + " " + cornerRadius + " " + direction;
      return "M " + pointerEdge + ", " + (y - pointerWidth / 2) + "\n      L " + x + ", " + y + "\n      L " + pointerEdge + ", " + (y + pointerWidth / 2) + "\n      L " + pointerEdge + ", " + (bottomEdge - cornerRadius) + "\n      A " + arc + " " + (pointerEdge + sign * cornerRadius) + ", " + bottomEdge + "\n      L " + (oppositeEdge - sign * cornerRadius) + ", " + bottomEdge + "\n      A " + arc + " " + oppositeEdge + ", " + (bottomEdge - cornerRadius) + "\n      L " + oppositeEdge + ", " + (topEdge + cornerRadius) + "\n      A " + arc + " " + (oppositeEdge - sign * cornerRadius) + ", " + topEdge + "\n      L " + (pointerEdge + sign * cornerRadius) + ", " + topEdge + "\n      A " + arc + " " + pointerEdge + ", " + (topEdge + cornerRadius) + "\n      z";
    }
  }, {
    key: "getFlyoutPath",
    value: function getFlyoutPath(props) {
      var orientation = props.orientation || "top";
      return orientation === "left" || orientation === "right" ? this.getHorizontalPath(props) : this.getVerticalPath(props);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          datum = _props.datum,
          active = _props.active,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          events = _props.events,
          pathComponent = _props.pathComponent,
          transform = _props.transform;

      var style = Helpers.evaluateStyle(this.props.style, datum, active);
      var path = this.getFlyoutPath(this.props);
      return React.cloneElement(pathComponent, { style: style, className: className, shapeRendering: shapeRendering, role: role, events: events, transform: transform, d: path });
    }
  }]);

  return Flyout;
}(React.Component);

Flyout.propTypes = _extends({}, CommonProps, {
  cornerRadius: PropTypes.number,
  datum: PropTypes.object,
  dx: PropTypes.number,
  dy: PropTypes.number,
  height: PropTypes.number,
  orientation: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  pathComponent: PropTypes.element,
  pointerLength: PropTypes.number,
  pointerWidth: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
});
Flyout.defaultProps = {
  pathComponent: React.createElement(Path, null)
};
export default Flyout;