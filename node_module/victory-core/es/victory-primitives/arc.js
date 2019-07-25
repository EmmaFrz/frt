import _assign from "lodash/assign";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 180] }]*/
import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";

import CommonProps from "./common-props";
import Path from "./path";

var Arc = function (_React$Component) {
  _inherits(Arc, _React$Component);

  function Arc() {
    _classCallCheck(this, Arc);

    return _possibleConstructorReturn(this, (Arc.__proto__ || Object.getPrototypeOf(Arc)).apply(this, arguments));
  }

  _createClass(Arc, [{
    key: "getStyle",
    value: function getStyle(props) {
      var style = props.style,
          datum = props.datum,
          active = props.active;

      return Helpers.evaluateStyle(_assign({ stroke: "black", fill: "none" }, style), datum, active);
    }
  }, {
    key: "getArcPath",
    value: function getArcPath(props) {
      var cx = props.cx,
          cy = props.cy,
          r = props.r,
          startAngle = props.startAngle,
          endAngle = props.endAngle,
          closedPath = props.closedPath;
      // Always draw the path as two arcs so that complete circles may be rendered.

      var halfAngle = Math.abs(endAngle - startAngle) / 2 + startAngle;
      var x1 = cx + r * Math.cos(Helpers.degreesToRadians(startAngle));
      var y1 = cy - r * Math.sin(Helpers.degreesToRadians(startAngle));
      var x2 = cx + r * Math.cos(Helpers.degreesToRadians(halfAngle));
      var y2 = cy - r * Math.sin(Helpers.degreesToRadians(halfAngle));
      var x3 = cx + r * Math.cos(Helpers.degreesToRadians(endAngle));
      var y3 = cy - r * Math.sin(Helpers.degreesToRadians(endAngle));
      var largerArcFlag1 = halfAngle - startAngle <= 180 ? 0 : 1;
      var largerArcFlag2 = endAngle - halfAngle <= 180 ? 0 : 1;
      var arcStart = closedPath ? " M " + cx + ", " + cy + " L " + x1 + ", " + y1 : "M " + x1 + ", " + y1;
      var arc1 = "A " + r + ", " + r + ", 0, " + largerArcFlag1 + ", 0, " + x2 + ", " + y2;
      var arc2 = "A " + r + ", " + r + ", 0, " + largerArcFlag2 + ", 0, " + x3 + ", " + y3;
      var arcEnd = closedPath ? "Z" : "";
      return arcStart + " " + arc1 + " " + arc2 + " " + arcEnd;
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          events = _props.events,
          pathComponent = _props.pathComponent,
          transform = _props.transform;

      return React.cloneElement(pathComponent, {
        d: this.getArcPath(this.props),
        style: this.getStyle(this.props),
        className: className, role: role, shapeRendering: shapeRendering, events: events, transform: transform
      });
    }
  }]);

  return Arc;
}(React.Component);

Arc.propTypes = _extends({}, CommonProps, {
  closedPath: PropTypes.bool,
  cx: PropTypes.number,
  cy: PropTypes.number,
  datum: PropTypes.any,
  endAngle: PropTypes.number,
  pathComponent: PropTypes.element,
  r: PropTypes.number,
  startAngle: PropTypes.number
});
Arc.defaultProps = {
  pathComponent: React.createElement(Path, null)
};
export default Arc;