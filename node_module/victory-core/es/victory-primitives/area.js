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
import { defined, getXAccessor, getYAccessor, getY0Accessor, getAngleAccessor } from "./helpers";

import * as d3Shape from "d3-shape";
import CommonProps from "./common-props";
import Path from "./path";

var Area = function (_React$Component) {
  _inherits(Area, _React$Component);

  function Area() {
    _classCallCheck(this, Area);

    return _possibleConstructorReturn(this, (Area.__proto__ || Object.getPrototypeOf(Area)).apply(this, arguments));
  }

  _createClass(Area, [{
    key: "getLineFunction",
    value: function getLineFunction(props) {
      var polar = props.polar,
          scale = props.scale;

      var interpolation = this.toNewName(props.interpolation);
      return polar ? d3Shape.lineRadial().defined(defined).curve(d3Shape[interpolation + "Closed"]).angle(getAngleAccessor(scale)).radius(getY0Accessor(scale)) : d3Shape.line().defined(defined).curve(d3Shape[interpolation]).x(getXAccessor(scale)).y(getYAccessor(scale));
    }
  }, {
    key: "getAreaFunction",
    value: function getAreaFunction(props) {
      var polar = props.polar,
          scale = props.scale;

      var interpolation = this.toNewName(props.interpolation);
      return polar ? d3Shape.radialArea().defined(defined).curve(d3Shape[interpolation + "Closed"]).angle(getAngleAccessor(scale)).outerRadius(getYAccessor(scale)).innerRadius(getY0Accessor(scale)) : d3Shape.area().defined(defined).curve(d3Shape[interpolation]).x(getXAccessor(scale)).y1(getYAccessor(scale)).y0(getY0Accessor(scale));
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
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          polar = _props.polar,
          origin = _props.origin,
          data = _props.data,
          active = _props.active,
          pathComponent = _props.pathComponent,
          events = _props.events,
          groupComponent = _props.groupComponent;

      var style = Helpers.evaluateStyle(_assign({ fill: "black" }, this.props.style), data, active);
      var defaultTransform = polar && origin ? "translate(" + origin.x + ", " + origin.y + ")" : undefined;
      var transform = this.props.transform || defaultTransform;
      var renderLine = style.stroke && style.stroke !== "none" && style.stroke !== "transparent";
      var areaFunction = this.getAreaFunction(this.props);
      var lineFunction = renderLine && this.getLineFunction(this.props);

      var areaStroke = style.stroke ? "none" : style.fill;

      var sharedProps = { className: className, role: role, shapeRendering: shapeRendering, transform: transform, events: events };
      var area = React.cloneElement(pathComponent, _assign({
        key: "area", style: _assign({}, style, { stroke: areaStroke }), d: areaFunction(data)
      }, sharedProps));

      var line = renderLine ? React.cloneElement(pathComponent, _assign({
        key: "area-stroke", style: _assign({}, style, { fill: "none" }), d: lineFunction(data)
      }, sharedProps)) : null;

      return renderLine ? React.cloneElement(groupComponent, {}, [area, line]) : area;
    }
  }]);

  return Area;
}(React.Component);

Area.propTypes = _extends({}, CommonProps, {
  groupComponent: PropTypes.element,
  interpolation: PropTypes.string,
  pathComponent: PropTypes.element
});
Area.defaultProps = {
  groupComponent: React.createElement("g", null),
  pathComponent: React.createElement(Path, null)
};
export default Area;