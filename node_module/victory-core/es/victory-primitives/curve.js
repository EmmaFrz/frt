import _assign from "lodash/assign";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";
import { defined, getXAccessor, getYAccessor, getAngleAccessor } from "./helpers";

import * as d3Shape from "d3-shape";
import CommonProps from "./common-props";
import Path from "./path";

var Curve = function (_React$Component) {
  _inherits(Curve, _React$Component);

  function Curve() {
    _classCallCheck(this, Curve);

    return _possibleConstructorReturn(this, (Curve.__proto__ || Object.getPrototypeOf(Curve)).apply(this, arguments));
  }

  _createClass(Curve, [{
    key: "getLineFunction",
    value: function getLineFunction(props) {
      var polar = props.polar,
          scale = props.scale,
          openCurve = props.openCurve;

      var interpolation = polar && !openCurve ? this.toNewName(props.interpolation) + "Closed" : this.toNewName(props.interpolation);
      return polar ? d3Shape.lineRadial().defined(defined).curve(d3Shape[interpolation]).angle(getAngleAccessor(scale)).radius(getYAccessor(scale)) : d3Shape.line().defined(defined).curve(d3Shape[interpolation]).x(getXAccessor(scale)).y(getYAccessor(scale));
    }
  }, {
    key: "toNewName",
    value: function toNewName(interpolation) {
      // d3 shape changed the naming scheme for interpolators from "basis" -> "curveBasis" etc.
      var capitalize = function (s) {
        return s && s[0].toUpperCase() + s.slice(1);
      };
      return "curve" + capitalize(interpolation);
    }
  }, {
    key: "render",
    value: function render() {
      var _props = this.props,
          data = _props.data,
          active = _props.active,
          events = _props.events,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          polar = _props.polar,
          origin = _props.origin,
          pathComponent = _props.pathComponent;

      var style = Helpers.evaluateStyle(_assign({ fill: "none", stroke: "black" }, this.props.style), data, active);
      var lineFunction = this.getLineFunction(this.props);
      var path = lineFunction(data);
      var defaultTransform = polar && origin ? "translate(" + origin.x + ", " + origin.y + ")" : undefined;
      var transform = this.props.transform || defaultTransform;
      return React.cloneElement(pathComponent, {
        className: className, style: style, role: role, shapeRendering: shapeRendering, transform: transform, events: events, d: path
      });
    }
  }]);

  return Curve;
}(React.Component);

Curve.propTypes = _extends({}, CommonProps, {
  interpolation: PropTypes.string,
  openCurve: PropTypes.bool,
  origin: PropTypes.object,
  pathComponent: PropTypes.element,
  polar: PropTypes.bool
});
Curve.defaultProps = {
  pathComponent: React.createElement(Path, null)
};
export default Curve;