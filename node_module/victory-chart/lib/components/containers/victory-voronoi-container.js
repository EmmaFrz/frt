Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.voronoiContainerMixin = undefined;

var _pick2 = require("lodash/pick");

var _pick3 = _interopRequireDefault(_pick2);

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _defaults2 = require("lodash/defaults");

var _defaults3 = _interopRequireDefault(_defaults2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _victoryCore = require("victory-core");

var _voronoiHelpers = require("./voronoi-helpers");

var _voronoiHelpers2 = _interopRequireDefault(_voronoiHelpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var voronoiContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class = function (_base) {
    _inherits(VictoryVoronoiContainer, _base);

    function VictoryVoronoiContainer() {
      _classCallCheck(this, VictoryVoronoiContainer);

      return _possibleConstructorReturn(this, (VictoryVoronoiContainer.__proto__ || Object.getPrototypeOf(VictoryVoronoiContainer)).apply(this, arguments));
    }

    _createClass(VictoryVoronoiContainer, [{
      key: "getLabelPadding",
      value: function getLabelPadding(style) {
        if (!style) {
          return 0;
        }
        var paddings = Array.isArray(style) ? style.map(function (s) {
          return s.padding;
        }) : [style.padding];
        return Math.max.apply(Math, _toConsumableArray(paddings).concat([0]));
      }
    }, {
      key: "getFlyoutSize",
      value: function getFlyoutSize(labelComponent, text, style) {
        var padding = this.getLabelPadding(style);
        var textSize = _victoryCore.TextSize.approximateTextSize(text, style);
        return {
          x: labelComponent.width || textSize.width + padding,
          y: labelComponent.height || textSize.height + padding
        };
      }
    }, {
      key: "getLabelCornerRadius",
      value: function getLabelCornerRadius(props, labelProps) {
        if (labelProps.cornerRadius !== undefined) {
          return labelProps.cornerRadius;
        }
        var theme = props.theme || labelProps.theme;
        return theme.tooltip && theme.tooltip.cornerRadius || 0;
      }
    }, {
      key: "getFlyoutExtent",
      value: function getFlyoutExtent(position, props, labelProps) {
        var text = labelProps.text,
            style = labelProps.style;
        var orientation = labelProps.orientation,
            _labelProps$dx = labelProps.dx,
            dx = _labelProps$dx === undefined ? 0 : _labelProps$dx,
            _labelProps$dy = labelProps.dy,
            dy = _labelProps$dy === undefined ? 0 : _labelProps$dy;

        var flyoutSize = this.getFlyoutSize(props.labelComponent, text, style);
        var cornerRadius = this.getLabelCornerRadius(props, labelProps);
        var x = position.x + dx + 2 * cornerRadius;
        var y = position.y + dy + 2 * cornerRadius;
        var width = orientation === "top" || orientation === "bottom" ? flyoutSize.x / 2 : flyoutSize.x;
        var horizontalSign = orientation === "left" ? -1 : 1;
        var verticalSign = orientation === "bottom" ? 1 : -1;
        var extent = {};
        if (orientation === "top" || orientation === "bottom") {
          extent.x = [x - width, x + width];
        } else {
          extent.x = [x, x + horizontalSign * width];
        }
        extent.y = [y, y + verticalSign * flyoutSize.y];
        return {
          x: [Math.min.apply(Math, _toConsumableArray(extent.x)), Math.max.apply(Math, _toConsumableArray(extent.x))],
          y: [Math.min.apply(Math, _toConsumableArray(extent.y)), Math.max.apply(Math, _toConsumableArray(extent.y))]
        };
      }
    }, {
      key: "getPoint",
      value: function getPoint(props, point) {
        var whitelist = ["_x", "_x1", "_x0", "_y", "_y1", "_y0"];
        if (!props.horizontal) {
          return (0, _pick3.default)(point, whitelist);
        }
        return {
          _x: point._y, _y: point._x, _x1: point._y1, _y1: point._x1, _x0: point._y0, _y0: point._x0
        };
      }
    }, {
      key: "getLabelPosition",
      value: function getLabelPosition(props, points, labelProps) {
        var mousePosition = props.mousePosition,
            voronoiDimension = props.voronoiDimension,
            scale = props.scale,
            voronoiPadding = props.voronoiPadding;

        var point = this.getPoint(props, points[0]);
        var basePosition = _victoryCore.Helpers.scalePoint(props, point);
        if (!voronoiDimension || points.length < 2) {
          return basePosition;
        }

        var x = voronoiDimension === "y" ? mousePosition.x : basePosition.x;
        var y = voronoiDimension === "x" ? mousePosition.y : basePosition.y;
        if (props.polar) {
          // TODO: Should multi-point tooltips be constrained within a circular chart?
          return { x: x, y: y };
        }
        var range = { x: scale.x.range(), y: scale.y.range() };
        var extent = {
          x: [Math.min.apply(Math, _toConsumableArray(range.x)) + voronoiPadding, Math.max.apply(Math, _toConsumableArray(range.x)) - voronoiPadding],
          y: [Math.min.apply(Math, _toConsumableArray(range.y)) + voronoiPadding, Math.max.apply(Math, _toConsumableArray(range.y)) - voronoiPadding]
        };
        var flyoutExtent = this.getFlyoutExtent({ x: x, y: y }, props, labelProps);
        var adjustments = {
          x: [flyoutExtent.x[0] < extent.x[0] ? extent.x[0] - flyoutExtent.x[0] : 0, flyoutExtent.x[1] > extent.x[1] ? flyoutExtent.x[1] - extent.x[1] : 0],
          y: [flyoutExtent.y[0] < extent.y[0] ? extent.y[0] - flyoutExtent.y[0] : 0, flyoutExtent.y[1] > extent.y[1] ? flyoutExtent.y[1] - extent.y[1] : 0]
        };
        return {
          x: Math.round(x + adjustments.x[0] - adjustments.x[1]),
          y: Math.round(y + adjustments.y[0] - adjustments.y[1])
        };
      }
    }, {
      key: "getStyle",
      value: function getStyle(props, points, type) {
        var labels = props.labels,
            labelComponent = props.labelComponent,
            theme = props.theme;

        var componentProps = labelComponent.props || {};
        var themeStyles = theme && theme.voronoi && theme.voronoi.style ? theme.voronoi.style : {};
        var componentStyleArray = type === "flyout" ? componentProps.flyoutStyle : componentProps.style;
        return points.reduce(function (memo, point, index) {
          var text = _victoryCore.Helpers.evaluateProp(labels, point, true);
          var textArray = text !== undefined ? ("" + text).split("\n") : [];
          var baseStyle = point.style && point.style[type] || {};
          var componentStyle = Array.isArray(componentStyleArray) ? componentStyleArray[index] : componentStyleArray;
          var style = _victoryCore.Helpers.evaluateStyle((0, _defaults3.default)({}, componentStyle, baseStyle, themeStyles[type]), point, true);
          var styleArray = textArray.length ? textArray.map(function () {
            return style;
          }) : [style];
          memo = memo.concat(styleArray);
          return memo;
        }, []);
      }
    }, {
      key: "getDefaultLabelProps",
      value: function getDefaultLabelProps(props, points) {
        var voronoiDimension = props.voronoiDimension,
            horizontal = props.horizontal;

        var point = this.getPoint(props, points[0]);
        var multiPoint = voronoiDimension && points.length > 1;
        var y = point._y1 !== undefined ? point._y1 : point._y;
        var defaultHorizontalOrientation = y < 0 ? "left" : "right";
        var defaultOrientation = y < 0 ? "bottom" : "top";
        var orientation = horizontal ? defaultHorizontalOrientation : defaultOrientation;
        return {
          orientation: multiPoint ? "top" : orientation,
          pointerLength: multiPoint ? 0 : undefined
        };
      }
    }, {
      key: "getLabelProps",
      value: function getLabelProps(props, points) {
        var labels = props.labels,
            scale = props.scale,
            labelComponent = props.labelComponent,
            theme = props.theme;

        var text = points.reduce(function (memo, point, index) {
          var t = (0, _isFunction3.default)(labels) ? labels(point, index, points) : null;
          if (t === null || t === undefined) {
            return memo;
          }
          memo = memo.concat(("" + t).split("\n"));
          return memo;
        }, []);
        var componentProps = labelComponent.props || {};

        // remove properties from first point to make datum
        // eslint-disable-next-line no-unused-vars

        var _points$ = points[0],
            childName = _points$.childName,
            style = _points$.style,
            continuous = _points$.continuous,
            datum = _objectWithoutProperties(_points$, ["childName", "style", "continuous"]);

        var labelProps = (0, _defaults3.default)({
          active: true,
          flyoutStyle: this.getStyle(props, points, "flyout")[0],
          renderInPortal: false,
          style: this.getStyle(props, points, "labels"),
          datum: datum,
          scale: scale,
          theme: theme,
          text: text
        }, componentProps, this.getDefaultLabelProps(props, points));
        var labelPosition = this.getLabelPosition(props, points, labelProps);
        return (0, _defaults3.default)({}, labelPosition, labelProps);
      }
    }, {
      key: "getTooltip",
      value: function getTooltip(props) {
        var labels = props.labels,
            activePoints = props.activePoints,
            labelComponent = props.labelComponent;

        if (!labels) {
          return null;
        }
        if (Array.isArray(activePoints) && activePoints.length) {
          return _react2.default.cloneElement(labelComponent, this.getLabelProps(props, activePoints));
        } else {
          return null;
        }
      }

      // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        var children = _react2.default.Children.toArray(props.children);
        return [].concat(_toConsumableArray(children), [this.getTooltip(props)]).map(function (component, i) {
          return component ? _react2.default.cloneElement(component, { key: i }) : null;
        });
      }
    }]);

    return VictoryVoronoiContainer;
  }(base), _class.displayName = "VictoryVoronoiContainer", _class.propTypes = _extends({}, _victoryCore.VictoryContainer.propTypes, {
    activateData: _propTypes2.default.bool,
    activateLabels: _propTypes2.default.bool,
    disable: _propTypes2.default.bool,
    labelComponent: _propTypes2.default.element,
    labels: _propTypes2.default.func,
    onActivated: _propTypes2.default.func,
    onDeactivated: _propTypes2.default.func,
    radius: _propTypes2.default.number,
    voronoiBlacklist: _propTypes2.default.arrayOf(_propTypes2.default.string),
    voronoiDimension: _propTypes2.default.oneOf(["x", "y"]),
    voronoiPadding: _propTypes2.default.number
  }), _class.defaultProps = _extends({}, _victoryCore.VictoryContainer.defaultProps, {
    activateData: true,
    activateLabels: true,
    labelComponent: _react2.default.createElement(_victoryCore.VictoryTooltip, null),
    voronoiPadding: 5
  }), _class.defaultEvents = function (props) {
    return [{
      target: "parent",
      eventHandlers: {
        onMouseLeave: function (evt, targetProps) {
          return props.disable ? {} : _voronoiHelpers2.default.onMouseLeave(evt, targetProps);
        },
        onTouchCancel: function (evt, targetProps) {
          return props.disable ? {} : _voronoiHelpers2.default.onMouseLeave(evt, targetProps);
        },
        onMouseMove: function (evt, targetProps) {
          return props.disable ? {} : _voronoiHelpers2.default.onMouseMove(evt, targetProps);
        },
        onTouchMove: function (evt, targetProps) {
          return props.disable ? {} : _voronoiHelpers2.default.onMouseMove(evt, targetProps);
        }
      }
    }, {
      target: "data",
      eventHandlers: props.disable ? {} : {
        onMouseOver: function () {
          return null;
        },
        onMouseOut: function () {
          return null;
        },
        onMouseMove: function () {
          return null;
        }
      }
    }];
  }, _temp;
};

exports.voronoiContainerMixin = voronoiContainerMixin;
exports.default = voronoiContainerMixin(_victoryCore.VictoryContainer);