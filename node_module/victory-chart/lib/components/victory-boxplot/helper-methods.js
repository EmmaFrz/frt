Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseProps = exports.getData = exports.getDomain = undefined;

var _keys2 = require("lodash/keys");

var _keys3 = _interopRequireDefault(_keys2);

var _groupBy2 = require("lodash/groupBy");

var _groupBy3 = _interopRequireDefault(_groupBy2);

var _uniq2 = require("lodash/uniq");

var _uniq3 = _interopRequireDefault(_uniq2);

var _assign3 = require("lodash/assign");

var _assign4 = _interopRequireDefault(_assign3);

var _defaults2 = require("lodash/defaults");

var _defaults3 = _interopRequireDefault(_defaults2);

var _orderBy2 = require("lodash/orderBy");

var _orderBy3 = _interopRequireDefault(_orderBy2);

var _victoryCore = require("victory-core");

var _d3Array = require("d3-array");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TYPES = ["max", "min", "median", "q1", "q3"];

var checkProcessedData = function (props, data) {
  /* check if the data is pre-processed. start by checking that it has
  all required quartile attributes. */
  var hasQuartileAttributes = data.every(function (datum) {
    return TYPES.every(function (val) {
      return typeof datum["_" + val] === "number";
    });
  });

  if (hasQuartileAttributes) {
    // check that the indepedent variable is distinct
    var values = data.map(function (_ref) {
      var _x = _ref._x,
          _y = _ref._y;
      return props.horizontal ? _y : _x;
    });
    if (!(0, _uniq3.default)(values).length === values.length) {
      throw new Error("\n        data prop may only take an array of objects with a unique\n        independent variable. Make sure your x or y values are distinct.\n      ");
    }
    return true;
  }
  return false;
};

var getSummaryStatistics = function (data, horizontal) {
  var dependentVars = data.map(function (datum) {
    return horizontal ? datum._x : datum._y;
  });
  var quartiles = {
    _q1: (0, _d3Array.quantile)(dependentVars, 0.25), // eslint-disable-line no-magic-numbers
    _q3: (0, _d3Array.quantile)(dependentVars, 0.75), // eslint-disable-line no-magic-numbers
    _min: (0, _d3Array.min)(dependentVars),
    _median: (0, _d3Array.quantile)(dependentVars, 0.5),
    _max: (0, _d3Array.max)(dependentVars)
  };

  return horizontal ? (0, _assign4.default)({}, quartiles, { _y: data[0]._y }) : (0, _assign4.default)({}, quartiles, { _x: data[0]._x });
};

var isHorizontal = function (props, data) {
  var arrayX = data.every(function (datum) {
    return Array.isArray(datum._x);
  });

  return arrayX || props.horizontal;
};

var processData = function (props, data) {
  /* check if the data is coming in a pre-processed form,
  i.e. { x || y, min, max, q1, q3, median }. if not, process it. */
  var isProcessed = checkProcessedData(props, data);
  if (!isProcessed) {
    // check if the data is coming with x or y values as an array
    var arrayX = data.every(function (datum) {
      return Array.isArray(datum._x);
    });
    var arrayY = data.every(function (datum) {
      return Array.isArray(datum._y);
    });
    var horizontal = arrayX || props.horizontal;
    var sortKey = horizontal ? "_x" : "_y";
    var groupKey = horizontal ? "_y" : "_x";
    if (arrayX && arrayY) {
      throw new Error("\n        data may not be given with array values for both x and y\n      ");
    } else if (arrayX || arrayY) {
      /* generate summary statistics for each datum. to do this, flatten
      the depedentVarArray and process each datum separately */
      return data.map(function (datum) {
        var dataArray = datum[sortKey].map(function (d) {
          return (0, _assign4.default)({}, datum, _defineProperty({}, sortKey, d));
        });
        var sortedData = (0, _orderBy3.default)(dataArray, sortKey);
        return getSummaryStatistics(sortedData, horizontal);
      });
    } else {
      /* Group data by independent variable and generate summary statistics for each group */
      var groupedData = (0, _groupBy3.default)(data, groupKey);
      return (0, _keys3.default)(groupedData).map(function (key) {
        var datum = groupedData[key];
        var sortedData = (0, _orderBy3.default)(datum, sortKey);
        return getSummaryStatistics(sortedData, horizontal);
      });
    }
  } else {
    return data;
  }
};

var getData = function (props) {
  var accessorTypes = TYPES.concat("x", "y");
  var formattedData = _victoryCore.Data.formatData(props.data, props, accessorTypes);
  return formattedData.length ? processData(props, formattedData) : [];
};

var reduceDataset = function (dataset, props, axis) {
  var minDomain = _victoryCore.Domain.getMinFromProps(props, axis);
  var maxDomain = _victoryCore.Domain.getMaxFromProps(props, axis);

  var minData = minDomain !== undefined ? minDomain : dataset.reduce(function (memo, datum) {
    return memo < datum["_" + axis] ? memo : datum["_" + axis];
  }, Infinity);
  var maxData = maxDomain !== undefined ? maxDomain : dataset.reduce(function (memo, datum) {
    return memo > datum["_" + axis] ? memo : datum["_" + axis];
  }, -Infinity);
  return _victoryCore.Domain.getDomainFromMinMax(minData, maxData);
};

var getDomainFromMinMaxValues = function (dataset, props, axis) {
  var minDomain = _victoryCore.Domain.getMinFromProps(props, axis);
  var maxDomain = _victoryCore.Domain.getMaxFromProps(props, axis);
  var minData = minDomain !== undefined ? minDomain : dataset.reduce(function (memo, datum) {
    return memo < datum._min ? memo : datum._min;
  }, Infinity);
  var maxData = maxDomain !== undefined ? maxDomain : dataset.reduce(function (memo, datum) {
    return memo > datum._max ? memo : datum._max;
  }, -Infinity);
  return _victoryCore.Domain.getDomainFromMinMax(minData, maxData);
};

var getDomainFromData = function (props, axis) {
  var minDomain = _victoryCore.Domain.getMinFromProps(props, axis);
  var maxDomain = _victoryCore.Domain.getMaxFromProps(props, axis);
  var dataset = getData(props);
  if (dataset.length < 1) {
    var scaleDomain = _victoryCore.Scale.getBaseScale(props, axis).domain();
    var min = minDomain !== undefined ? minDomain : _victoryCore.Collection.getMinValue(scaleDomain);
    var max = maxDomain !== undefined ? maxDomain : _victoryCore.Collection.getMaxValue(scaleDomain);
    return _victoryCore.Domain.getDomainFromMinMax(min, max);
  }
  return props.horizontal && axis === "x" || !props.horizontal && axis === "y" ? getDomainFromMinMaxValues(dataset, props, axis) : reduceDataset(dataset, props, axis);
};

var getDomain = function (props, axis) {
  return _victoryCore.Domain.createDomainFunction(getDomainFromData)(props, axis);
};

var getStyles = function (props, styleObject) {
  var style = props.style || {};
  styleObject = styleObject || {};
  var parentStyles = { height: "100%", width: "100%" };
  var labelStyles = (0, _defaults3.default)({}, style.labels, styleObject.labels);
  var boxStyles = (0, _defaults3.default)({}, style.boxes, styleObject.boxes);
  var whiskerStyles = (0, _defaults3.default)({}, style.whiskers, styleObject.whiskers);
  return {
    boxes: boxStyles,
    labels: labelStyles,
    parent: (0, _defaults3.default)({}, style.parent, styleObject.parent, parentStyles),
    max: (0, _defaults3.default)({}, style.max, styleObject.max, whiskerStyles),
    maxLabels: (0, _defaults3.default)({}, style.maxLabels, styleObject.maxlabels, labelStyles),
    median: (0, _defaults3.default)({}, style.median, styleObject.median, whiskerStyles),
    medianLabels: (0, _defaults3.default)({}, style.medianLabels, styleObject.medianlabels, labelStyles),
    min: (0, _defaults3.default)({}, style.min, styleObject.min, whiskerStyles),
    minLabels: (0, _defaults3.default)({}, style.minLabels, styleObject.minlabels, labelStyles),
    q1: (0, _defaults3.default)({}, style.q1, styleObject.q1, boxStyles),
    q1Labels: (0, _defaults3.default)({}, style.q1Labels, styleObject.q1labels, labelStyles),
    q3: (0, _defaults3.default)({}, style.q3, styleObject.q3, boxStyles),
    q3Labels: (0, _defaults3.default)({}, style.q3Labels, styleObject.q3labels, labelStyles),
    whiskers: whiskerStyles
  };
};

var getCalculatedValues = function (props) {
  var theme = props.theme;

  var data = getData(props);
  var horizontal = isHorizontal(props, data);
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
  var defaultStyles = theme && theme.boxplot && theme.boxplot.style ? theme.boxplot.style : {};
  var style = getStyles(props, defaultStyles);
  var defaultLabelOrientation = horizontal ? "top" : "right";
  var labelOrientation = props.labelOrientation || defaultLabelOrientation;
  var boxWidth = props.boxWidth || 1;
  return { data: data, horizontal: horizontal, domain: domain, scale: scale, style: style, labelOrientation: labelOrientation, boxWidth: boxWidth };
};

// eslint-disable-next-line complexity
var getWhiskerProps = function (props, type) {
  var horizontal = props.horizontal,
      style = props.style,
      boxWidth = props.boxWidth,
      whiskerWidth = props.whiskerWidth,
      datum = props.datum,
      scale = props.scale,
      index = props.index;
  var _props$positions = props.positions,
      min = _props$positions.min,
      max = _props$positions.max,
      q1 = _props$positions.q1,
      q3 = _props$positions.q3,
      x = _props$positions.x,
      y = _props$positions.y;

  var boxValue = type === "min" ? q1 : q3;
  var whiskerValue = type === "min" ? min : max;
  var width = typeof whiskerWidth === "number" ? whiskerWidth : boxWidth;
  return {
    datum: datum, index: index, scale: scale,
    majorWhisker: {
      x1: horizontal ? boxValue : x,
      y1: horizontal ? y : boxValue,
      x2: horizontal ? whiskerValue : x,
      y2: horizontal ? y : whiskerValue
    },
    minorWhisker: {
      x1: horizontal ? whiskerValue : x - width / 2,
      y1: horizontal ? y - width / 2 : whiskerValue,
      x2: horizontal ? whiskerValue : x + width / 2,
      y2: horizontal ? y + width / 2 : whiskerValue
    },
    style: style[type] || style.whisker
  };
};

var getBoxProps = function (props, type) {
  var horizontal = props.horizontal,
      boxWidth = props.boxWidth,
      style = props.style,
      scale = props.scale,
      datum = props.datum,
      index = props.index;
  var _props$positions2 = props.positions,
      median = _props$positions2.median,
      q1 = _props$positions2.q1,
      q3 = _props$positions2.q3,
      x = _props$positions2.x,
      y = _props$positions2.y;

  var defaultX = type === "q1" ? q1 : median;
  var defaultY = type === "q1" ? median : q3;
  var defaultWidth = type === "q1" ? median - q1 : q3 - median;
  var defaultHeight = type === "q1" ? q1 - median : median - q3;
  return {
    datum: datum, scale: scale, index: index,
    x: horizontal ? defaultX : x - boxWidth / 2,
    y: horizontal ? y - boxWidth / 2 : defaultY,
    width: horizontal ? defaultWidth : boxWidth,
    height: horizontal ? boxWidth : defaultHeight,
    style: style[type] || style.boxes
  };
};

var getMedianProps = function (props) {
  var boxWidth = props.boxWidth,
      horizontal = props.horizontal,
      style = props.style,
      datum = props.datum,
      scale = props.scale,
      index = props.index;
  var _props$positions3 = props.positions,
      median = _props$positions3.median,
      x = _props$positions3.x,
      y = _props$positions3.y;

  return {
    datum: datum, scale: scale, index: index,
    x1: horizontal ? median : x - boxWidth / 2,
    y1: horizontal ? y - boxWidth / 2 : median,
    x2: horizontal ? median : x + boxWidth / 2,
    y2: horizontal ? y + boxWidth / 2 : median,
    style: style.median
  };
};

var getText = function (props, type) {
  var datum = props.datum,
      index = props.index,
      labels = props.labels;

  var propName = type + "Labels";
  var labelProp = props[propName];
  if (!labelProp && !labels) {
    return null;
  } else if (labelProp === true || labels === true) {
    var dataName = "_" + type;
    return "" + datum[dataName];
  }
  return Array.isArray(labelProp) ? labelProp[index] : labelProp;
};

var getLabelProps = function (props, text, type) {
  var datum = props.datum,
      positions = props.positions,
      index = props.index,
      boxWidth = props.boxWidth,
      horizontal = props.horizontal,
      labelOrientation = props.labelOrientation,
      style = props.style;

  var namespace = type + "Labels";
  var labelStyle = style[namespace] || style.labels;
  var defaultVerticalAnchor = horizontal ? "end" : "middle";
  var defaultTextAnchor = horizontal ? "middle" : "start";
  var whiskerWidth = typeof props.whiskerWidth === "number" ? props.whiskerWidth : boxWidth;
  var width = type === "min" || type === "max" ? whiskerWidth : boxWidth;

  var getDefaultPosition = function (coord) {
    var sign = {
      x: labelOrientation === "left" ? -1 : 1, y: labelOrientation === "top" ? -1 : 1
    };
    return positions[coord] + sign[coord] * width / 2 + sign[coord] * (labelStyle.padding || 0);
  };

  return {
    text: text, datum: datum, index: index,
    style: labelStyle,
    y: horizontal ? getDefaultPosition("y") : positions[type],
    x: horizontal ? positions[type] : getDefaultPosition("x"),
    textAnchor: labelStyle.textAnchor || defaultTextAnchor,
    verticalAnchor: labelStyle.verticalAnchor || defaultVerticalAnchor,
    angle: labelStyle.angle
  };
};

var getDataProps = function (props, type) {
  if (type === "median") {
    return getMedianProps(props);
  } else if (type === "min" || type === "max") {
    return getWhiskerProps(props, type);
  }
  return getBoxProps(props, type);
};

var getBaseProps = function (props, fallbackProps) {
  var modifiedProps = _victoryCore.Helpers.modifyProps(props, fallbackProps, "boxplot");
  props = (0, _assign4.default)({}, modifiedProps, getCalculatedValues(modifiedProps));
  var _props = props,
      groupComponent = _props.groupComponent,
      width = _props.width,
      height = _props.height,
      padding = _props.padding,
      standalone = _props.standalone,
      theme = _props.theme,
      events = _props.events,
      sharedEvents = _props.sharedEvents,
      scale = _props.scale,
      horizontal = _props.horizontal,
      data = _props.data,
      style = _props.style,
      domain = _props.domain;

  var initialChildProps = {
    parent: {
      domain: domain, scale: scale, width: width, height: height, data: data, standalone: standalone,
      theme: theme, style: style.parent || {}, padding: padding, groupComponent: groupComponent
    }
  };
  var boxScale = horizontal ? scale.x : scale.y;

  return data.reduce(function (acc, datum, index) {
    var eventKey = datum.eventKey !== undefined ? datum.eventKey : index;
    var positions = {
      x: scale.x(datum._x),
      y: scale.y(datum._y),
      min: boxScale(datum._min),
      max: boxScale(datum._max),
      median: boxScale(datum._median),
      q1: boxScale(datum._q1),
      q3: boxScale(datum._q3)
    };
    var dataProps = (0, _assign4.default)({ index: index, datum: datum, positions: positions }, props);
    var dataObj = TYPES.reduce(function (memo, type) {
      memo[type] = getDataProps(dataProps, type);
      return memo;
    }, {});

    acc[eventKey] = dataObj;

    TYPES.forEach(function (type) {
      var labelText = getText(dataProps, type);
      var labelProp = props.labels || props[type + "Labels"];
      if (labelText !== null && labelText !== undefined || labelProp && (events || sharedEvents)) {
        var target = type + "Labels";
        acc[eventKey][target] = getLabelProps(dataProps, labelText, type);
      }
    });

    return acc;
  }, initialChildProps);
};

exports.getDomain = getDomain;
exports.getData = getData;
exports.getBaseProps = getBaseProps;