Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = exports.getDomain = exports.getBaseProps = undefined;

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getData = function (props) {
  var accessorTypes = ["x", "high", "low", "close", "open"];
  return _victoryCore.Data.formatData(props.data, props, accessorTypes);
};

var reduceData = function (dataset, axis, type) {
  var yDataTypes = { min: "_low", max: "_high" };
  var dataType = axis === "x" ? "_x" : yDataTypes[type];
  var baseCondition = type === "min" ? Infinity : -Infinity;
  return dataset.reduce(function (memo, datum) {
    var current = datum[dataType];
    return memo < current && type === "min" || memo > current && type === "max" ? memo : current;
  }, baseCondition);
};

var getDomainFromData = function (props, axis) {
  var minDomain = _victoryCore.Domain.getMinFromProps(props, axis);
  var maxDomain = _victoryCore.Domain.getMaxFromProps(props, axis);
  var dataset = getData(props);
  if (dataset.length < 1) {
    var scaleDomain = _victoryCore.Scale.getBaseScale(props, axis).domain();
    var _min = minDomain !== undefined ? minDomain : _victoryCore.Collection.getMinValue(scaleDomain);
    var _max = maxDomain !== undefined ? maxDomain : _victoryCore.Collection.getMaxValue(scaleDomain);
    return _victoryCore.Domain.getDomainFromMinMax(_min, _max);
  }
  var min = minDomain !== undefined ? minDomain : reduceData(dataset, axis, "min");
  var max = maxDomain !== undefined ? maxDomain : reduceData(dataset, axis, "max");
  return _victoryCore.Domain.getDomainFromMinMax(min, max);
};

var getDomain = function (props, axis) {
  return _victoryCore.Domain.createDomainFunction(getDomainFromData)(props, axis);
};

var getCalculatedValues = function (props) {
  var theme = props.theme,
      polar = props.polar;

  var defaultStyle = theme && theme.candlestick && theme.candlestick.style ? theme.candlestick.style : {};
  var style = _victoryCore.Helpers.getStyles(props.style, defaultStyle);
  var data = getData(props);
  var range = {
    x: _victoryCore.Helpers.getRange(props, "x"),
    y: _victoryCore.Helpers.getRange(props, "y")
  };
  var domain = {
    x: getDomain(props, "x"),
    y: getDomain(props, "y")
  };
  var scale = {
    x: _victoryCore.Scale.getBaseScale(props, "x").domain(domain.x).range(range.x),
    y: _victoryCore.Scale.getBaseScale(props, "y").domain(domain.y).range(range.y)
  };
  var origin = polar ? props.origin || _victoryCore.Helpers.getPolarOrigin(props) : undefined;
  return { domain: domain, data: data, scale: scale, style: style, origin: origin };
};

var isTransparent = function (attr) {
  return attr === "none" || attr === "transparent";
};

var getDataStyles = function (datum, style, props) {
  style = style || {};
  var candleColor = datum.open > datum.close ? props.candleColors.negative : props.candleColors.positive;
  var fill = style.fill || candleColor;
  var strokeColor = style.stroke;
  var stroke = isTransparent(strokeColor) ? fill : strokeColor || "black";
  return (0, _assign3.default)({}, style, { stroke: stroke, fill: fill });
};

var getLabelProps = function (dataProps, text, style) {
  var x = dataProps.x,
      high = dataProps.high,
      index = dataProps.index,
      scale = dataProps.scale,
      datum = dataProps.datum,
      data = dataProps.data;

  var labelStyle = style.labels || {};
  return {
    style: labelStyle,
    y: high - (labelStyle.padding || 0),
    x: x,
    text: text,
    index: index,
    scale: scale,
    datum: datum,
    data: data,
    textAnchor: labelStyle.textAnchor,
    verticalAnchor: labelStyle.verticalAnchor || "end",
    angle: labelStyle.angle
  };
};

var getBaseProps = function (props, fallbackProps) {
  // eslint-disable-line max-statements
  props = _victoryCore.Helpers.modifyProps(props, fallbackProps, "candlestick");
  var calculatedValues = getCalculatedValues(props);
  var data = calculatedValues.data,
      style = calculatedValues.style,
      scale = calculatedValues.scale,
      domain = calculatedValues.domain,
      origin = calculatedValues.origin;
  var _props = props,
      groupComponent = _props.groupComponent,
      width = _props.width,
      height = _props.height,
      padding = _props.padding,
      standalone = _props.standalone,
      theme = _props.theme,
      polar = _props.polar,
      wickStrokeWidth = _props.wickStrokeWidth,
      labels = _props.labels,
      events = _props.events,
      sharedEvents = _props.sharedEvents;

  var initialChildProps = { parent: {
      domain: domain, scale: scale, width: width, height: height, data: data, standalone: standalone, theme: theme, polar: polar, origin: origin,
      style: style.parent, padding: padding
    } };

  return data.reduce(function (childProps, datum, index) {
    var eventKey = datum.eventKey || index;
    var x = scale.x(datum._x1 !== undefined ? datum._x1 : datum._x);
    var high = scale.y(datum._high);
    var close = scale.y(datum._close);
    var open = scale.y(datum._open);
    var low = scale.y(datum._low);
    var candleHeight = Math.abs(scale.y(datum._open) - scale.y(datum._close));
    var dataStyle = getDataStyles(datum, style.data, props);
    var dataProps = {
      x: x, high: high, low: low, candleHeight: candleHeight, scale: scale, data: data, datum: datum, groupComponent: groupComponent, index: index,
      style: dataStyle, padding: padding, width: width, polar: polar, origin: origin, wickStrokeWidth: wickStrokeWidth, open: open, close: close
    };

    childProps[eventKey] = {
      data: dataProps
    };
    var text = _victoryCore.LabelHelpers.getText(props, datum, index);
    if (text !== undefined && text !== null || labels && (events || sharedEvents)) {
      childProps[eventKey].labels = getLabelProps(dataProps, text, style);
    }

    return childProps;
  }, initialChildProps);
};

exports.getBaseProps = getBaseProps;
exports.getDomain = getDomain;
exports.getData = getData;