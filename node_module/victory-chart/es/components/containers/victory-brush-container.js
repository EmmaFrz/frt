import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import React from "react";
import { VictoryContainer, Selection } from "victory-core";
import BrushHelpers from "./brush-helpers";

import isEqual from "react-fast-compare";

export var brushContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class = function (_base) {
    _inherits(VictoryBrushContainer, _base);

    function VictoryBrushContainer() {
      _classCallCheck(this, VictoryBrushContainer);

      return _possibleConstructorReturn(this, (VictoryBrushContainer.__proto__ || Object.getPrototypeOf(VictoryBrushContainer)).apply(this, arguments));
    }

    _createClass(VictoryBrushContainer, [{
      key: "getSelectBox",
      value: function getSelectBox(props, coordinates) {
        var x = coordinates.x,
            y = coordinates.y;
        var brushStyle = props.brushStyle,
            brushComponent = props.brushComponent;

        var brushComponentStyle = brushComponent.props && brushComponent.props.style;
        return x[0] !== x[1] && y[0] !== y[1] ? React.cloneElement(brushComponent, {
          width: Math.abs(x[1] - x[0]) || 1,
          height: Math.abs(y[1] - y[0]) || 1,
          x: Math.min(x[0], x[1]),
          y: Math.min(y[0], y[1]),
          cursor: "move",
          style: _defaults({}, brushComponentStyle, brushStyle)
        }) : null;
      }
    }, {
      key: "getHandles",
      value: function getHandles(props, coordinates) {
        var brushDimension = props.brushDimension,
            handleWidth = props.handleWidth,
            handleStyle = props.handleStyle,
            handleComponent = props.handleComponent;
        var x = coordinates.x,
            y = coordinates.y;

        var width = Math.abs(x[1] - x[0]) || 1;
        var height = Math.abs(y[1] - y[0]) || 1;
        var handleComponentStyle = handleComponent.props && handleComponent.props.style || {};
        var style = _defaults({}, handleComponentStyle, handleStyle);
        var yProps = { style: style, width: width, height: handleWidth, cursor: "ns-resize" };
        var xProps = { style: style, width: handleWidth, height: height, cursor: "ew-resize" };
        var handleProps = {
          top: brushDimension !== "x" && _assign({ x: x[0], y: y[1] - handleWidth / 2 }, yProps),
          bottom: brushDimension !== "x" && _assign({ x: x[0], y: y[0] - handleWidth / 2 }, yProps),
          left: brushDimension !== "y" && _assign({ y: y[1], x: x[0] - handleWidth / 2 }, xProps),
          right: brushDimension !== "y" && _assign({ y: y[1], x: x[1] - handleWidth / 2 }, xProps)
        };
        var handles = ["top", "bottom", "left", "right"].reduce(function (memo, curr) {
          memo = handleProps[curr] ? memo.concat(React.cloneElement(handleComponent, _assign({ key: "handle-" + curr }, handleProps[curr]))) : memo;
          return memo;
        }, []);
        return handles.length ? handles : null;
      }
    }, {
      key: "getRect",
      value: function getRect(props) {
        var currentDomain = props.currentDomain,
            cachedBrushDomain = props.cachedBrushDomain;

        var brushDomain = _defaults({}, props.brushDomain, props.domain);
        var domain = isEqual(brushDomain, cachedBrushDomain) ? _defaults({}, currentDomain, brushDomain) : brushDomain;
        var coordinates = Selection.getDomainCoordinates(props, domain);
        var selectBox = this.getSelectBox(props, coordinates);
        return selectBox ? React.createElement(
          "g",
          null,
          selectBox,
          this.getHandles(props, coordinates)
        ) : null;
      }

      // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        var children = React.Children.toArray(props.children);
        return [].concat(_toConsumableArray(children), [this.getRect(props)]).map(function (component, i) {
          return component ? React.cloneElement(component, { key: i }) : null;
        });
      }
    }]);

    return VictoryBrushContainer;
  }(base), _class.displayName = "VictoryBrushContainer", _class.propTypes = _extends({}, VictoryContainer.propTypes, {
    allowDrag: PropTypes.bool,
    allowDraw: PropTypes.bool,
    allowResize: PropTypes.bool,
    brushComponent: PropTypes.element,
    brushDimension: PropTypes.oneOf(["x", "y"]),
    brushDomain: PropTypes.shape({
      x: PropTypes.array,
      y: PropTypes.array
    }),
    brushStyle: PropTypes.object,
    defaultBrushArea: PropTypes.oneOf(["all", "disable", "none"]),
    disable: PropTypes.bool,
    handleComponent: PropTypes.element,
    handleStyle: PropTypes.object,
    handleWidth: PropTypes.number,
    onBrushDomainChange: PropTypes.func
  }), _class.defaultProps = _extends({}, VictoryContainer.defaultProps, {
    allowDrag: true,
    allowDraw: true,
    allowResize: true,
    brushComponent: React.createElement("rect", null),
    brushStyle: {
      stroke: "transparent",
      fill: "black",
      fillOpacity: 0.1
    },
    handleComponent: React.createElement("rect", null),
    handleStyle: {
      stroke: "transparent",
      fill: "transparent"
    },
    handleWidth: 8
  }), _class.defaultEvents = function (props) {
    return [{
      target: "parent",
      eventHandlers: {
        onMouseDown: function (evt, targetProps) {
          return props.disable ? {} : BrushHelpers.onMouseDown(evt, targetProps);
        },
        onTouchStart: function (evt, targetProps) {
          return props.disable ? {} : BrushHelpers.onMouseDown(evt, targetProps);
        },
        onMouseMove: function (evt, targetProps) {
          return props.disable ? {} : BrushHelpers.onMouseMove(evt, targetProps);
        },
        onTouchMove: function (evt, targetProps) {
          return props.disable ? {} : BrushHelpers.onMouseMove(evt, targetProps);
        },
        onMouseUp: function (evt, targetProps) {
          return props.disable ? {} : BrushHelpers.onMouseUp(evt, targetProps);
        },
        onTouchEnd: function (evt, targetProps) {
          return props.disable ? {} : BrushHelpers.onMouseUp(evt, targetProps);
        },
        onMouseLeave: function (evt, targetProps) {
          return props.disable ? {} : BrushHelpers.onMouseLeave(evt, targetProps);
        },
        onTouchCancel: function (evt, targetProps) {
          return props.disable ? {} : BrushHelpers.onMouseLeave(evt, targetProps);
        }
      }
    }];
  }, _temp;
};

export default brushContainerMixin(VictoryContainer);