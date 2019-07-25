Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBaseProps = undefined;

var _without2 = require("lodash/without");

var _without3 = _interopRequireDefault(_without2);

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _d3Voronoi = require("d3-voronoi");

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var getVoronoi = function (props, range, scale) {
  var minRange = [Math.min.apply(Math, _toConsumableArray(range.x)), Math.min.apply(Math, _toConsumableArray(range.y))];
  var maxRange = [Math.max.apply(Math, _toConsumableArray(range.x)), Math.max.apply(Math, _toConsumableArray(range.y))];
  var angleAccessor = function (d) {
    var x = scale.x(d._x1 !== undefined ? d._x1 : d._x);
    return -1 * x + Math.PI / 2;
  };
  var xAccessor = function (d) {
    return scale.x(d._x1 !== undefined ? d._x1 : d._x);
  };
  return (0, _d3Voronoi.voronoi)().x(function (d) {
    return props.polar ? angleAccessor(d) : xAccessor(d);
  }).y(function (d) {
    return scale.y(d._y1 !== undefined ? d._y1 : d._y);
  }).extent([minRange, maxRange]);
};

var getCalculatedValues = function (props) {
  var defaultStyles = props.theme && props.theme.voronoi && props.theme.voronoi.style ? props.theme.voronoi.style : {};
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
  var voronoi = getVoronoi(props, range, scale);
  var polygons = voronoi.polygons(data);
  var origin = props.polar ? props.origin || _victoryCore.Helpers.getPolarOrigin(props) : undefined;
  return { domain: domain, data: data, scale: scale, style: style, polygons: polygons, origin: origin };
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
      polygons = _props.polygons,
      scale = _props.scale,
      sharedEvents = _props.sharedEvents,
      standalone = _props.standalone,
      style = _props.style,
      theme = _props.theme,
      width = _props.width,
      labels = _props.labels;

  var initialChildProps = { parent: {
      style: style.parent, scale: scale, domain: domain, data: data, standalone: standalone, height: height, width: width, theme: theme,
      origin: origin, polar: polar, padding: padding
    } };

  return data.reduce(function (childProps, datum, index) {
    var polygon = (0, _without3.default)(polygons[index], "data");
    var eventKey = datum.eventKey;

    var _Helpers$scalePoint = _victoryCore.Helpers.scalePoint(props, datum),
        x = _Helpers$scalePoint.x,
        y = _Helpers$scalePoint.y;

    var dataProps = {
      x: x, y: y, datum: datum, data: data, index: index, scale: scale, polygon: polygon, origin: origin,
      size: props.size,
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