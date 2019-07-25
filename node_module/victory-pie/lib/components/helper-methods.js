Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseProps = undefined;

var _isPlainObject2 = require("lodash/isPlainObject");

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _d3Shape = require("d3-shape");

var d3Shape = _interopRequireWildcard(_d3Shape);

var _victoryCore = require("victory-core");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2, 45, 135, 180, 225, 315] }]*/
var degreesToRadians = function (degrees) {
  return degrees * (Math.PI / 180);
};

var checkForValidText = function (text) {
  if (text === undefined || text === null) {
    return text;
  } else {
    return "" + text;
  }
};

var getColor = function (style, colors, index) {
  if (style && style.data && style.data.fill) {
    return style.data.fill;
  }
  return colors && colors[index % colors.length];
};

var getRadius = function (props, padding) {
  if (props.radius) {
    return props.radius;
  }
  return Math.min(props.width - padding.left - padding.right, props.height - padding.top - padding.bottom) / 2;
};

var getOrigin = function (props, padding) {
  var width = props.width,
      height = props.height;

  var origin = (0, _isPlainObject3.default)(props.origin) ? props.origin : {};
  return {
    x: origin.x !== undefined ? origin.x : (padding.left - padding.right + width) / 2,
    y: origin.y !== undefined ? origin.y : (padding.top - padding.bottom + height) / 2
  };
};

var getSlices = function (props, data) {
  var layoutFunction = d3Shape.pie().sort(null).startAngle(degreesToRadians(props.startAngle)).endAngle(degreesToRadians(props.endAngle)).padAngle(degreesToRadians(props.padAngle)).value(function (datum) {
    return datum._y;
  });
  return layoutFunction(data);
};

var getCalculatedValues = function (props) {
  var theme = props.theme,
      colorScale = props.colorScale;

  var styleObject = theme && theme.pie && theme.pie.style ? theme.pie.style : {};
  var style = _victoryCore.Helpers.getStyles(props.style, styleObject, "auto", "100%");
  var colors = Array.isArray(colorScale) ? colorScale : _victoryCore.Style.getColorScale(colorScale);
  var padding = _victoryCore.Helpers.getPadding(props);
  var radius = getRadius(props, padding);
  var origin = getOrigin(props, padding);
  var data = _victoryCore.Data.getData(props);
  var slices = getSlices(props, data);
  var pathFunction = d3Shape.arc().cornerRadius(props.cornerRadius).outerRadius(radius).innerRadius(props.innerRadius);
  return { style: style, colors: colors, padding: padding, radius: radius, data: data, slices: slices, pathFunction: pathFunction, origin: origin };
};

var getSliceStyle = function (index, calculatedValues) {
  var style = calculatedValues.style,
      colors = calculatedValues.colors;

  var fill = getColor(style, colors, index);
  return (0, _assign3.default)({ fill: fill }, style.data);
};

var getLabelText = function (props, datum, index) {
  var text = void 0;
  if (datum.label) {
    text = datum.label;
  } else if (Array.isArray(props.labels)) {
    text = props.labels[index];
  } else {
    text = (0, _isFunction3.default)(props.labels) ? props.labels(datum) : datum.xName || datum._x;
  }
  return checkForValidText(text);
};

var getLabelPosition = function (radius, labelRadius, style) {
  var padding = style && style.padding || 0;
  var arcRadius = labelRadius || radius + padding;
  return d3Shape.arc().outerRadius(arcRadius).innerRadius(arcRadius);
};

var getLabelOrientation = function (slice) {
  var radiansToDegrees = function (radians) {
    return radians * (180 / Math.PI);
  };
  var start = radiansToDegrees(slice.startAngle);
  var end = radiansToDegrees(slice.endAngle);
  var degree = start + (end - start) / 2;
  if (degree < 45 || degree > 315) {
    return "top";
  } else if (degree >= 45 && degree < 135) {
    return "right";
  } else if (degree >= 135 && degree < 225) {
    return "bottom";
  } else {
    return "left";
  }
};

var getTextAnchor = function (orientation) {
  if (orientation === "top" || orientation === "bottom") {
    return "middle";
  }
  return orientation === "right" ? "start" : "end";
};

var getVerticalAnchor = function (orientation) {
  if (orientation === "left" || orientation === "right") {
    return "middle";
  }
  return orientation === "bottom" ? "start" : "end";
};

var getLabelProps = function (props, dataProps, calculatedValues) {
  var index = dataProps.index,
      datum = dataProps.datum,
      data = dataProps.data,
      slice = dataProps.slice;
  var style = calculatedValues.style,
      radius = calculatedValues.radius,
      origin = calculatedValues.origin;

  var labelStyle = _victoryCore.Helpers.evaluateStyle((0, _assign3.default)({ padding: 0 }, style.labels), datum, props.active);
  var labelRadius = _victoryCore.Helpers.evaluateProp(props.labelRadius, datum);
  var labelPosition = getLabelPosition(radius, labelRadius, labelStyle);
  var position = labelPosition.centroid(slice);
  var orientation = getLabelOrientation(slice);
  return {
    index: index, datum: datum, data: data, slice: slice, orientation: orientation,
    style: labelStyle,
    x: Math.round(position[0]) + origin.x,
    y: Math.round(position[1]) + origin.y,
    text: getLabelText(props, datum, index),
    textAnchor: labelStyle.textAnchor || getTextAnchor(orientation),
    verticalAnchor: labelStyle.verticalAnchor || getVerticalAnchor(orientation),
    angle: labelStyle.angle
  };
};

var getBaseProps = exports.getBaseProps = function (props, fallbackProps) {
  props = _victoryCore.Helpers.modifyProps(props, fallbackProps, "pie");
  var calculatedValues = getCalculatedValues(props);
  var slices = calculatedValues.slices,
      style = calculatedValues.style,
      pathFunction = calculatedValues.pathFunction,
      data = calculatedValues.data,
      origin = calculatedValues.origin;
  var _props = props,
      labels = _props.labels,
      events = _props.events,
      sharedEvents = _props.sharedEvents,
      height = _props.height,
      width = _props.width,
      standalone = _props.standalone;

  var initialChildProps = {
    parent: { standalone: standalone, height: height, width: width, slices: slices, pathFunction: pathFunction, style: style.parent }
  };

  return slices.reduce(function (childProps, slice, index) {
    var datum = data[index];
    var eventKey = datum.eventKey || index;
    var dataProps = {
      index: index, slice: slice, pathFunction: pathFunction, datum: datum, data: data, origin: origin,
      style: getSliceStyle(index, calculatedValues)
    };
    childProps[eventKey] = {
      data: dataProps
    };
    var text = getLabelText(props, datum, index);
    if (text !== undefined && text !== null || labels && (events || sharedEvents)) {
      childProps[eventKey].labels = getLabelProps(props, dataProps, calculatedValues);
    }
    return childProps;
  }, initialChildProps);
};