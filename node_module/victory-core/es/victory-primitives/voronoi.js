import _uniqueId from "lodash/uniqueId";
import _isObject from "lodash/isObject";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*eslint no-magic-numbers: ["error", { "ignore": [2] }]*/
import React from "react";
import PropTypes from "prop-types";

import Helpers from "../victory-util/helpers";
import CommonProps from "./common-props";
import ClipPath from "../victory-primitives/clip-path";
import Path from "../victory-primitives/path";
import Circle from "../victory-primitives/circle";

var Voronoi = function (_React$Component) {
  _inherits(Voronoi, _React$Component);

  function Voronoi(props) {
    _classCallCheck(this, Voronoi);

    var _this = _possibleConstructorReturn(this, (Voronoi.__proto__ || Object.getPrototypeOf(Voronoi)).call(this, props));

    _this.clipId = !_isObject(props) || props.clipId === undefined ? _uniqueId("voronoi-clip-") : props.clipId;
    return _this;
  }

  _createClass(Voronoi, [{
    key: "getVoronoiPath",
    value: function getVoronoiPath(props) {
      var polygon = props.polygon;

      return Array.isArray(polygon) && polygon.length ? "M " + props.polygon.join("L") + " Z" : "";
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
          x = _props.x,
          y = _props.y,
          transform = _props.transform,
          pathComponent = _props.pathComponent,
          clipPathComponent = _props.clipPathComponent,
          groupComponent = _props.groupComponent,
          circleComponent = _props.circleComponent;

      var voronoiPath = this.getVoronoiPath(this.props);
      var style = Helpers.evaluateStyle(this.props.style, datum, active);
      var size = Helpers.evaluateProp(this.props.size, datum, active);

      if (size) {
        var circle = React.cloneElement(circleComponent, {
          key: "circle", style: style, className: className, role: role, shapeRendering: shapeRendering, events: events,
          clipPath: "url(#" + this.clipId + ")", cx: x, cy: y, r: size
        });
        var voronoiClipPath = React.cloneElement(clipPathComponent, { key: "voronoi-clip", clipId: this.clipId }, React.cloneElement(pathComponent, { d: voronoiPath, className: className }));
        return React.cloneElement(groupComponent, {}, [voronoiClipPath, circle]);
      }
      return React.cloneElement(pathComponent, {
        style: style, className: className, d: voronoiPath, role: role, shapeRendering: shapeRendering, events: events, transform: transform
      });
    }
  }]);

  return Voronoi;
}(React.Component);

Voronoi.propTypes = _extends({}, CommonProps, {
  circleComponent: PropTypes.element,
  clipId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  clipPathComponent: PropTypes.element,
  datum: PropTypes.object,
  groupComponent: PropTypes.element,
  pathComponent: PropTypes.element,
  polygon: PropTypes.array,
  size: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
});
Voronoi.defaultProps = {
  pathComponent: React.createElement(Path, null),
  circleComponent: React.createElement(Circle, null),
  clipPathComponent: React.createElement(ClipPath, null),
  groupComponent: React.createElement("g", null)
};
export default Voronoi;