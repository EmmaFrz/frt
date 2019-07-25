Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSymbol = exports.getBubbleSize = exports.getSize = exports.getBaseProps = undefined;

var _values2 = require("lodash/values");

var _values3 = _interopRequireDefault(_values2);

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getSymbol = function (data, props) {
  if (props.bubbleProperty) {
    return "circle";
  }
  return data.symbol || props.symbol;
};

var getBubbleSize = function (datum, props) {
  var data = props.data,
      z = props.z,
      maxBubbleSize = props.maxBubbleSize,
      minBubbleSize = props.minBubbleSize;

  var zData = data.map(function (point) {
    return point[z];
  });
  var zMin = Math.min.apply(Math, _toConsumableArray(zData));
  var zMax = Math.max.apply(Math, _toConsumableArray(zData));
  var getMaxRadius = function () {
    var minPadding = Math.min.apply(Math, _toConsumableArray((0, _values3.default)(_victoryCore.Helpers.getPadding(props))));
    return Math.max(minPadding, 5); // eslint-disable-line no-magic-numbers
  };
  var maxRadius = maxBubbleSize || getMaxRadius();
  var minRadius = minBubbleSize || maxRadius * 0.1; // eslint-disable-line no-magic-numbers
  if (zMax === zMin) {
    return Math.max(minRadius, 1);
  }
  var maxArea = Math.PI * Math.pow(maxRadius, 2);
  var minArea = Math.PI * Math.pow(minRadius, 2);
  var pointArea = (datum[z] - zMin) / (zMax - zMin) * maxArea;
  var area = Math.max(pointArea, minArea);
  var radius = Math.sqrt(area / Math.PI);
  return Math.max(radius, 1);
};

var getSize = function (datum, props) {
  var size = props.size,
      z = props.z;

  if (datum.size) {
    return typeof datum.size === "function" ? datum.size : Math.max(datum.size, 1);
  } else if (typeof props.size === "function") {
    return size;
  } else if (datum[z]) {
    return getBubbleSize(datum, props);
  } else {
    return Math.max(size || 0, 1);
  }
};

var getCalculatedValues = function (props) {
  var defaultStyles = props.theme && props.theme.scatter && props.theme.scatter.style ? props.theme.scatter.style : {};
  var style = _victoryCore.Helpers.getStyles(props.style, defaultStyles);
  var data = _victoryCore.Data.getData(props);
  var range = {
    x: _victoryCore.Helpers.getRange(props, "x"),
    y: _victoryCore.Helpers.getRange(props, "y")
  };
  var domain = {
    x: _victoryCore.Domain.getDomain(props, "x"),
    y: _victoryCore.Domain.getDomain(props, "y")
  };
  var scale = {
    x: _victoryCore.Scale.getBaseScale(props, "x").domain(domain.x).range(range.x),
    y: _victoryCore.Scale.getBaseScale(props, "y").domain(domain.y).range(range.y)
  };
  var origin = props.polar ? props.origin || _victoryCore.Helpers.getPolarOrigin(props) : undefined;
  var z = props.bubbleProperty || "z";
  return { domain: domain, data: data, scale: scale, style: style, origin: origin, z: z };
};

var getBaseProps = function (props, fallbackProps) {
  var modifiedProps = _victoryCore.Helpers.modifyProps(props, fallbackProps, "scatter");
  props = (0, _assign3.default)({}, modifiedProps, getCalculatedValues(modifiedProps));
  var _props = props,
      data = _props.data,
      domain = _props.domain,
      events = _props.events,
      height = _props.height,
      origin = _props.origin,
      padding = _props.padding,
      polar = _props.polar,
      scale = _props.scale,
      sharedEvents = _props.sharedEvents,
      standalone = _props.standalone,
      style = _props.style,
      theme = _props.theme,
      width = _props.width,
      labels = _props.labels;

  var initialChildProps = { parent: {
      style: style.parent, scale: scale, domain: domain, data: data, height: height, width: width, standalone: standalone, theme: theme,
      origin: origin, polar: polar, padding: padding
    } };

  return data.reduce(function (childProps, datum, index) {
    var eventKey = datum.eventKey;

    var _Helpers$scalePoint = _victoryCore.Helpers.scalePoint(props, datum),
        x = _Helpers$scalePoint.x,
        y = _Helpers$scalePoint.y;

    var dataProps = {
      x: x, y: y, datum: datum, data: data, index: index, scale: scale, polar: polar, origin: origin,
      size: getSize(datum, props),
      symbol: getSymbol(datum, props),
      style: style.data
    };

    childProps[eventKey] = { data: dataProps };
    var text = _victoryCore.LabelHelpers.getText(props, datum, index);
    if (text !== undefined && text !== null || labels && (events || sharedEvents)) {
      childProps[eventKey].labels = _victoryCore.LabelHelpers.getProps(props, index);
    }

    return childProps;
  }, initialChildProps);
};

exports.getBaseProps = getBaseProps;
exports.getSize = getSize;
exports.getBubbleSize = getBubbleSize;
exports.getSymbol = getSymbol;