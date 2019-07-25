Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseProps = undefined;

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getBarPosition = function (props, datum) {
  var getDefaultMin = function (axis) {
    var defaultMin = _victoryCore.Scale.getType(props.scale[axis]) === "log" ? 1 / Number.MAX_SAFE_INTEGER : 0;
    return datum["_" + axis] instanceof Date ? new Date(defaultMin) : defaultMin;
  };
  var _y0 = datum._y0 !== undefined ? datum._y0 : getDefaultMin("y");
  var _x0 = datum._x0 !== undefined ? datum._x0 : getDefaultMin("x");
  return _victoryCore.Helpers.scalePoint(props, (0, _assign3.default)({}, datum, { _y0: _y0, _x0: _x0 }));
};

var getCalculatedValues = function (props) {
  var theme = props.theme,
      horizontal = props.horizontal,
      polar = props.polar;

  var defaultStyles = theme && theme.bar && theme.bar.style ? theme.bar.style : {};
  var style = _victoryCore.Helpers.getStyles(props.style, defaultStyles);
  var data = _victoryCore.Data.getData(props);
  var range = {
    x: _victoryCore.Helpers.getRange(props, "x"),
    y: _victoryCore.Helpers.getRange(props, "y")
  };
  var domain = {
    x: _victoryCore.Domain.getDomainWithZero(props, "x"),
    y: _victoryCore.Domain.getDomainWithZero(props, "y")
  };
  var xScale = _victoryCore.Scale.getBaseScale(props, "x").domain(domain.x).range(range.x);
  var yScale = _victoryCore.Scale.getBaseScale(props, "y").domain(domain.y).range(range.y);
  var scale = {
    x: horizontal ? yScale : xScale,
    y: horizontal ? xScale : yScale
  };
  var origin = polar ? props.origin || _victoryCore.Helpers.getPolarOrigin(props) : undefined;
  return { style: style, data: data, scale: scale, domain: domain, origin: origin };
};

var getBaseProps = function (props, fallbackProps) {
  var modifiedProps = _victoryCore.Helpers.modifyProps(props, fallbackProps, "bar");
  props = (0, _assign3.default)({}, modifiedProps, getCalculatedValues(modifiedProps));
  var _props = props,
      alignment = _props.alignment,
      barRatio = _props.barRatio,
      cornerRadius = _props.cornerRadius,
      data = _props.data,
      domain = _props.domain,
      events = _props.events,
      height = _props.height,
      horizontal = _props.horizontal,
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
      domain: domain, scale: scale, width: width, height: height, data: data, standalone: standalone,
      theme: theme, polar: polar, origin: origin, padding: padding, style: style.parent
    } };

  return data.reduce(function (childProps, datum, index) {
    var eventKey = datum.eventKey || index;

    var _getBarPosition = getBarPosition(props, datum),
        x = _getBarPosition.x,
        y = _getBarPosition.y,
        y0 = _getBarPosition.y0,
        x0 = _getBarPosition.x0;

    var dataProps = {
      alignment: alignment, barRatio: barRatio, cornerRadius: cornerRadius, data: data, datum: datum, horizontal: horizontal, index: index, padding: padding, polar: polar, origin: origin,
      scale: scale, style: style.data, width: width, height: height, x: x, y: y, y0: y0, x0: x0
    };

    childProps[eventKey] = {
      data: dataProps
    };

    var text = _victoryCore.LabelHelpers.getText(props, datum, index);
    if (text !== undefined && text !== null || labels && (events || sharedEvents)) {
      childProps[eventKey].labels = _victoryCore.LabelHelpers.getProps(props, index);
    }
    return childProps;
  }, initialChildProps);
};

exports.getBaseProps = getBaseProps;