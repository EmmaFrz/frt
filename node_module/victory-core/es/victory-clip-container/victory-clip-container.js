import _uniqueId from "lodash/uniqueId";
import _isObject from "lodash/isObject";
import _isFunction from "lodash/isFunction";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "../victory-util/prop-types";
import Helpers from "../victory-util/helpers";

import ClipPath from "../victory-primitives/clip-path";
import Circle from "../victory-primitives/circle";
import Rect from "../victory-primitives/rect";

var VictoryClipContainer = function (_React$Component) {
  _inherits(VictoryClipContainer, _React$Component);

  function VictoryClipContainer(props) {
    _classCallCheck(this, VictoryClipContainer);

    var _this = _possibleConstructorReturn(this, (VictoryClipContainer.__proto__ || Object.getPrototypeOf(VictoryClipContainer)).call(this, props));

    _this.clipId = !_isObject(props) || props.clipId === undefined ? _uniqueId("victory-clip-") : props.clipId;
    return _this;
  }

  _createClass(VictoryClipContainer, [{
    key: "calculateAttributes",
    value: function calculateAttributes(props) {
      var polar = props.polar,
          origin = props.origin,
          _props$clipWidth = props.clipWidth,
          clipWidth = _props$clipWidth === undefined ? 0 : _props$clipWidth,
          _props$clipHeight = props.clipHeight,
          clipHeight = _props$clipHeight === undefined ? 0 : _props$clipHeight,
          _props$translateX = props.translateX,
          translateX = _props$translateX === undefined ? 0 : _props$translateX,
          _props$translateY = props.translateY,
          translateY = _props$translateY === undefined ? 0 : _props$translateY;

      var clipPadding = Helpers.getPadding({ padding: props.clipPadding });
      var radius = props.radius || Helpers.getRadius(props);
      return {
        x: (polar ? origin.x : translateX) - clipPadding.left,
        y: (polar ? origin.y : translateY) - clipPadding.top,
        width: Math.max((polar ? radius : clipWidth) + clipPadding.left + clipPadding.right, 0),
        height: Math.max((polar ? radius : clipHeight) + clipPadding.top + clipPadding.bottom, 0)
      };
    }
  }, {
    key: "renderClippedGroup",
    value: function renderClippedGroup(props, clipId) {
      var style = props.style,
          events = props.events,
          transform = props.transform,
          children = props.children,
          className = props.className,
          groupComponent = props.groupComponent;

      var clipComponent = this.renderClipComponent(props, clipId);
      var clippedGroup = React.cloneElement(groupComponent, { key: "clipped-group", clipPath: "url(#" + clipId + ")" }, children);
      return React.cloneElement(groupComponent, _assign({ className: className, style: style, transform: transform }, events), [clipComponent, clippedGroup]);
    }
  }, {
    key: "renderGroup",
    value: function renderGroup(props) {
      var style = props.style,
          events = props.events,
          transform = props.transform,
          children = props.children,
          className = props.className,
          groupComponent = props.groupComponent;

      return React.cloneElement(groupComponent, _assign({ className: className, style: style, transform: transform }, events), children);
    }
  }, {
    key: "renderClipComponent",
    value: function renderClipComponent(props, clipId) {
      var polar = props.polar,
          origin = props.origin,
          _props$clipWidth2 = props.clipWidth,
          clipWidth = _props$clipWidth2 === undefined ? 0 : _props$clipWidth2,
          _props$clipHeight2 = props.clipHeight,
          clipHeight = _props$clipHeight2 === undefined ? 0 : _props$clipHeight2,
          _props$translateX2 = props.translateX,
          translateX = _props$translateX2 === undefined ? 0 : _props$translateX2,
          _props$translateY2 = props.translateY,
          translateY = _props$translateY2 === undefined ? 0 : _props$translateY2,
          circleComponent = props.circleComponent,
          rectComponent = props.rectComponent,
          clipPathComponent = props.clipPathComponent;

      var _Helpers$getPadding = Helpers.getPadding({ padding: props.clipPadding }),
          top = _Helpers$getPadding.top,
          bottom = _Helpers$getPadding.bottom,
          left = _Helpers$getPadding.left,
          right = _Helpers$getPadding.right;

      var child = void 0;
      if (polar) {
        var radius = props.radius || Helpers.getRadius(props);
        var circleProps = {
          r: Math.max(radius + left + right, radius + top + bottom, 0),
          cx: origin.x - left,
          cy: origin.y - top
        };
        child = React.cloneElement(circleComponent, circleProps);
      } else {
        var rectProps = {
          x: translateX - left, y: translateY - top,
          width: Math.max(clipWidth + left + right, 0),
          height: Math.max(clipHeight + top + bottom, 0)
        };
        child = React.cloneElement(rectComponent, rectProps);
      }

      return React.cloneElement(clipPathComponent, _assign({ key: "clip-path" }, props, { clipId: clipId }), child);
    }
  }, {
    key: "getClipValue",
    value: function getClipValue(props, axis) {
      var clipValues = { x: props.clipWidth, y: props.clipHeight };
      if (clipValues[axis] !== undefined) {
        return clipValues[axis];
      }
      var range = this.getRange(props, axis);
      return range ? Math.abs(range[0] - range[1]) || undefined : undefined;
    }
  }, {
    key: "getTranslateValue",
    value: function getTranslateValue(props, axis) {
      var translateValues = { x: props.translateX, y: props.translateY };
      if (translateValues[axis] !== undefined) {
        return translateValues[axis];
      }
      var range = this.getRange(props, axis);
      return range ? Math.min.apply(Math, _toConsumableArray(range)) : undefined;
    }
  }, {
    key: "getRange",
    value: function getRange(props, axis) {
      var scale = props.scale || {};
      if (!scale[axis]) {
        return undefined;
      }
      return _isFunction(scale[axis].range) ? scale[axis].range() : undefined;
    }
  }, {
    key: "render",
    value: function render() {
      var clipHeight = this.getClipValue(this.props, "y");
      var clipWidth = this.getClipValue(this.props, "x");
      if (clipWidth === undefined || clipHeight === undefined) {
        return this.renderGroup(this.props);
      }
      var translateX = this.getTranslateValue(this.props, "x");
      var translateY = this.getTranslateValue(this.props, "y");
      var clipProps = _defaults({}, this.props, { clipHeight: clipHeight, clipWidth: clipWidth, translateX: translateX, translateY: translateY });
      return this.renderClippedGroup(clipProps, this.clipId);
    }
  }]);

  return VictoryClipContainer;
}(React.Component);

VictoryClipContainer.displayName = "VictoryClipContainer";
VictoryClipContainer.role = "container";
VictoryClipContainer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  circleComponent: PropTypes.element,
  className: PropTypes.string,
  clipHeight: CustomPropTypes.nonNegative,
  clipId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  clipPadding: PropTypes.shape({
    top: PropTypes.number, bottom: PropTypes.number,
    left: PropTypes.number, right: PropTypes.number
  }),
  clipPathComponent: PropTypes.element,
  clipWidth: CustomPropTypes.nonNegative,
  events: PropTypes.object,
  groupComponent: PropTypes.element,
  origin: PropTypes.shape({ x: CustomPropTypes.nonNegative, y: CustomPropTypes.nonNegative }),
  polar: PropTypes.bool,
  radius: CustomPropTypes.nonNegative,
  style: PropTypes.object,
  transform: PropTypes.string,
  translateX: PropTypes.number,
  translateY: PropTypes.number
};
VictoryClipContainer.defaultProps = {
  circleComponent: React.createElement(Circle, null),
  rectComponent: React.createElement(Rect, null),
  clipPathComponent: React.createElement(ClipPath, null),
  groupComponent: React.createElement("g", null)
};
export default VictoryClipContainer;