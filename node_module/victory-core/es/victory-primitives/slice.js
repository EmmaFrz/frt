import _isFunction from "lodash/isFunction";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";
import CommonProps from "./common-props";
import Path from "./path";

var Slice = function (_React$Component) {
  _inherits(Slice, _React$Component);

  function Slice() {
    _classCallCheck(this, Slice);

    return _possibleConstructorReturn(this, (Slice.__proto__ || Object.getPrototypeOf(Slice)).apply(this, arguments));
  }

  _createClass(Slice, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          datum = _props.datum,
          slice = _props.slice,
          active = _props.active,
          role = _props.role,
          shapeRendering = _props.shapeRendering,
          className = _props.className,
          origin = _props.origin,
          events = _props.events,
          pathComponent = _props.pathComponent,
          pathFunction = _props.pathFunction,
          style = _props.style;

      var defaultTransform = origin ? "translate(" + origin.x + ", " + origin.y + ")" : undefined;
      var transform = this.props.transform || defaultTransform;
      return React.cloneElement(pathComponent, {
        className: className, role: role, shapeRendering: shapeRendering, events: events, transform: transform,
        style: Helpers.evaluateStyle(style, datum, active),
        d: _isFunction(pathFunction) ? pathFunction(slice) : undefined
      });
    }
  }]);

  return Slice;
}(React.Component);

Slice.propTypes = _extends({}, CommonProps, {
  datum: PropTypes.object,
  pathComponent: PropTypes.element,
  pathFunction: PropTypes.func,
  slice: PropTypes.object
});
Slice.defaultProps = {
  pathComponent: React.createElement(Path, null)
};
export default Slice;