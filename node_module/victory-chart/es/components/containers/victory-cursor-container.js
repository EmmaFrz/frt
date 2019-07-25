import _isObject from "lodash/isObject";
import _assign from "lodash/assign";
import _defaults from "lodash/defaults";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import React from "react";
import { VictoryContainer, VictoryLabel, Axis, Helpers } from "victory-core";

import CursorHelpers from "./cursor-helpers";

export var cursorContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class = function (_base) {
    _inherits(VictoryCursorContainer, _base);

    function VictoryCursorContainer() {
      _classCallCheck(this, VictoryCursorContainer);

      return _possibleConstructorReturn(this, (VictoryCursorContainer.__proto__ || Object.getPrototypeOf(VictoryCursorContainer)).apply(this, arguments));
    }

    _createClass(VictoryCursorContainer, [{
      key: "getCursorPosition",
      value: function getCursorPosition(props) {
        var cursorValue = props.cursorValue,
            defaultCursorValue = props.defaultCursorValue,
            cursorDimension = props.cursorDimension,
            domain = props.domain;

        if (cursorValue) {
          return cursorValue;
        }

        if (typeof defaultCursorValue === "number") {
          return _defineProperty({
            x: (domain.x[0] + domain.x[1]) / 2,
            y: (domain.y[0] + domain.y[1]) / 2
          }, cursorDimension, defaultCursorValue);
        }

        return defaultCursorValue;
      }
    }, {
      key: "getCursorLabelOffset",
      value: function getCursorLabelOffset(props) {
        var cursorLabelOffset = props.cursorLabelOffset;


        if (typeof cursorLabelOffset === "number") {
          return {
            x: cursorLabelOffset,
            y: cursorLabelOffset
          };
        }

        return cursorLabelOffset;
      }
    }, {
      key: "getPadding",
      value: function getPadding(props) {
        if (props.padding === undefined) {
          var child = props.children.find(function (c) {
            return _isObject(c.props) && c.props.padding !== undefined;
          });
          return Helpers.getPadding(child.props);
        } else {
          return Helpers.getPadding(props);
        }
      }
    }, {
      key: "getCursorElements",
      value: function getCursorElements(props) {
        // eslint-disable-line max-statements
        var scale = props.scale,
            cursorDimension = props.cursorDimension,
            cursorLabelComponent = props.cursorLabelComponent,
            cursorLabel = props.cursorLabel,
            cursorComponent = props.cursorComponent,
            width = props.width,
            height = props.height;

        var cursorValue = this.getCursorPosition(props);
        var cursorLabelOffset = this.getCursorLabelOffset(props);

        if (!cursorValue) {
          return [];
        }

        var newElements = [];
        var padding = this.getPadding(props);
        var cursorCoordinates = {
          x: scale.x(cursorValue.x),
          y: scale.y(cursorValue.y)
        };
        if (cursorLabel) {
          newElements.push(React.cloneElement(cursorLabelComponent, _defaults({ active: true }, cursorLabelComponent.props, {
            x: cursorCoordinates.x + cursorLabelOffset.x,
            y: cursorCoordinates.y + cursorLabelOffset.y,
            text: Helpers.evaluateProp(cursorLabel, cursorValue, true),
            active: true,
            key: "cursor-label"
          })));
        }

        var cursorStyle = _assign({ stroke: "black" }, cursorComponent.props.style);
        if (cursorDimension === "x" || cursorDimension === undefined) {
          newElements.push(React.cloneElement(cursorComponent, {
            key: "x-cursor",
            x1: cursorCoordinates.x,
            x2: cursorCoordinates.x,
            y1: padding.top,
            y2: height - padding.bottom,
            style: cursorStyle
          }));
        }
        if (cursorDimension === "y" || cursorDimension === undefined) {
          newElements.push(React.cloneElement(cursorComponent, {
            key: "y-cursor",
            x1: padding.left,
            x2: width - padding.right,
            y1: cursorCoordinates.y,
            y2: cursorCoordinates.y,
            style: cursorStyle
          }));
        }
        return newElements;
      }

      // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        return [].concat(_toConsumableArray(React.Children.toArray(props.children)), _toConsumableArray(this.getCursorElements(props)));
      }
    }]);

    return VictoryCursorContainer;
  }(base), _class.displayName = "VictoryCursorContainer", _class.propTypes = _extends({}, VictoryContainer.propTypes, {
    cursorDimension: PropTypes.oneOf(["x", "y"]),
    cursorLabel: PropTypes.func,
    cursorLabelComponent: PropTypes.element,
    cursorLabelOffset: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })]),
    defaultCursorValue: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    })]),
    disable: PropTypes.bool,
    onCursorChange: PropTypes.func
  }), _class.defaultProps = _extends({}, VictoryContainer.defaultProps, {
    cursorLabelComponent: React.createElement(VictoryLabel, null),
    cursorLabelOffset: {
      x: 5,
      y: -10
    },
    cursorComponent: React.createElement(Axis, null)
  }), _class.defaultEvents = function (props) {
    return [{
      target: "parent",
      eventHandlers: {
        onMouseLeave: function () {
          return [];
        },
        onTouchCancel: function () {
          return [];
        },
        onMouseMove: function (evt, targetProps) {
          return props.disable ? {} : CursorHelpers.onMouseMove(evt, targetProps);
        },
        onTouchMove: function (evt, targetProps) {
          return props.disable ? {} : CursorHelpers.onMouseMove(evt, targetProps);
        }
      }
    }];
  }, _temp;
};

export default cursorContainerMixin(VictoryContainer);