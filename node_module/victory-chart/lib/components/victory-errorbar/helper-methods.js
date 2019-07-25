Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getData = exports.getDomain = exports.getBaseProps = undefined;

var _victoryCore = require("victory-core");

var getErrors = function (datum, scale, axis) {
  /**
   * check if it is asymmetric error or symmetric error, asymmetric error should be an array
   * and the first value is the positive error, the second is the negative error
   * @param  {Boolean} isArray(errorX)
   * @return {String or Array}
   */

  var errorNames = { x: "_errorX", y: "_errorY" };
  var errors = datum[errorNames[axis]];
  if (errors === 0) {
    return false;
  }

  return Array.isArray(errors) ? [errors[0] === 0 ? false : scale[axis](errors[0] + datum["_" + axis]), errors[1] === 0 ? false : scale[axis](datum["_" + axis] - errors[1])] : [scale[axis](errors + datum["_" + axis]), scale[axis](datum["_" + axis] - errors)];
};

var getData = function (props) {
  var accessorTypes = ["x", "y", "errorX", "errorY"];
  if (props.data) {
    return _victoryCore.Data.formatData(props.data, props, accessorTypes);
  } else {
    var generatedData = props.errorX || props.errorY ? _victoryCore.Data.generateData(props) : [];
    return _victoryCore.Data.formatData(generatedData, props, accessorTypes);
  }
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
  var currentAxis = _victoryCore.Helpers.getCurrentAxis(axis, props.horizontal);
  var error = currentAxis === "x" ? "_errorX" : "_errorY";
  var reduceErrorData = function (type) {
    var baseCondition = type === "min" ? Infinity : -Infinity;
    var errorIndex = type === "min" ? 1 : 0;
    var sign = type === "min" ? -1 : 1;
    return dataset.reduce(function (memo, datum) {
      var currentError = Array.isArray(datum[error]) ? datum[error][errorIndex] : datum[error];
      var current = datum["_" + currentAxis] + sign * (currentError || 0);
      return memo < current && type === "min" || memo > current && type === "max" ? memo : current;
    }, baseCondition);
  };

  var min = minDomain !== undefined ? minDomain : reduceErrorData("min");
  var max = maxDomain !== undefined ? maxDomain : reduceErrorData("max");
  return _victoryCore.Domain.getDomainFromMinMax(min, max);
};

var getDomain = function (props, axis) {
  return _victoryCore.Domain.createDomainFunction(getDomainFromData)(props, axis);
};

var getCalculatedValues = function (props) {
  var defaultStyles = props.theme && props.theme.errorbar && props.theme.errorbar.style ? props.theme.errorbar.style : {};
  var style = _victoryCore.Helpers.getStyles(props.style, defaultStyles) || {};
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
  var origin = props.polar ? props.origin || _victoryCore.Helpers.getPolarOrigin(props) : undefined;
  return { domain: domain, data: data, scale: scale, style: style, origin: origin };
};

var getLabelProps = function (dataProps, text, style) {
  var x = dataProps.x,
      index = dataProps.index,
      scale = dataProps.scale,
      errorY = dataProps.errorY;

  var error = errorY && Array.isArray(errorY) ? errorY[0] : errorY;
  var y = error || dataProps.y;
  var labelStyle = style.labels || {};
  return {
    style: labelStyle,
    y: y - (labelStyle.padding || 0),
    x: x,
    text: text,
    index: index,
    scale: scale,
    datum: dataProps.datum,
    data: dataProps.data,
    textAnchor: labelStyle.textAnchor,
    verticalAnchor: labelStyle.verticalAnchor || "end",
    angle: labelStyle.angle
  };
};

var getBaseProps = function (props, fallbackProps) {
  props = _victoryCore.Helpers.modifyProps(props, fallbackProps, "errorbar");

  var _getCalculatedValues = getCalculatedValues(props, fallbackProps),
      data = _getCalculatedValues.data,
      style = _getCalculatedValues.style,
      scale = _getCalculatedValues.scale,
      domain = _getCalculatedValues.domain,
      origin = _getCalculatedValues.origin;

  var _props = props,
      groupComponent = _props.groupComponent,
      height = _props.height,
      width = _props.width,
      borderWidth = _props.borderWidth,
      standalone = _props.standalone,
      theme = _props.theme,
      polar = _props.polar,
      padding = _props.padding,
      labels = _props.labels,
      events = _props.events,
      sharedEvents = _props.sharedEvents;

  var initialChildProps = { parent: {
      domain: domain, scale: scale, data: data, height: height, width: width, standalone: standalone, theme: theme, polar: polar, origin: origin,
      padding: padding, style: style.parent
    } };

  return data.reduce(function (childProps, datum, index) {
    var eventKey = datum.eventKey || index;
    var x = scale.x(datum._x1 !== undefined ? datum._x1 : datum._x);
    var y = scale.y(datum._y1 !== undefined ? datum._y1 : datum._y);

    var dataProps = {
      x: x, y: y, scale: scale, datum: datum, data: data, index: index, groupComponent: groupComponent, borderWidth: borderWidth,
      style: style.data,
      errorX: getErrors(datum, scale, "x"),
      errorY: getErrors(datum, scale, "y")
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