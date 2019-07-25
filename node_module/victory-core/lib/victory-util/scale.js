Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _includes2 = require("lodash/includes");

var _includes3 = _interopRequireDefault(_includes2);

var _helpers = require("./helpers");

var _helpers2 = _interopRequireDefault(_helpers);

var _collection = require("./collection");

var _collection2 = _interopRequireDefault(_collection);

var _d3Scale = require("d3-scale");

var d3Scale = _interopRequireWildcard(_d3Scale);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supportedScaleStrings = ["linear", "time", "log", "sqrt"];

// Private Functions

/* eslint-disable func-style */
/* eslint-disable no-use-before-define */
function toNewName(scale) {
  // d3 scale changed the naming scheme for scale from "linear" -> "scaleLinear" etc.
  var capitalize = function (s) {
    return s && s[0].toUpperCase() + s.slice(1);
  };
  return "scale" + capitalize(scale);
}

function validScale(scale) {
  if (typeof scale === "function") {
    return (0, _isFunction3.default)(scale.copy) && (0, _isFunction3.default)(scale.domain) && (0, _isFunction3.default)(scale.range);
  } else if (typeof scale === "string") {
    return (0, _includes3.default)(supportedScaleStrings, scale);
  }
  return false;
}

function isScaleDefined(props, axis) {
  if (!props.scale) {
    return false;
  } else if (props.scale.x || props.scale.y) {
    return props.scale[axis] ? true : false;
  }
  return true;
}

function getScaleTypeFromProps(props, axis) {
  if (!isScaleDefined(props, axis)) {
    return undefined;
  }
  var scale = props.scale[axis] || props.scale;
  return typeof scale === "string" ? scale : getType(scale);
}

function getScaleFromDomain(props, axis) {
  var domain = void 0;
  if (props.domain && props.domain[axis]) {
    domain = props.domain[axis];
  } else if (props.domain && Array.isArray(props.domain)) {
    domain = props.domain;
  }
  if (!domain) {
    return undefined;
  }
  return _collection2.default.containsDates(domain) ? "time" : "linear";
}

function getScaleTypeFromData(props, axis) {
  if (!props.data) {
    return "linear";
  }
  var accessor = _helpers2.default.createAccessor(props[axis]);
  var axisData = props.data.map(accessor);
  return _collection2.default.containsDates(axisData) ? "time" : "linear";
}

// Exported Functions

function getBaseScale(props, axis) {
  var scale = getScaleFromProps(props, axis);
  if (scale) {
    return scale;
  }
  var defaultScale = getScaleFromDomain(props, axis) || getScaleTypeFromData(props, axis);
  return d3Scale[toNewName(defaultScale)]();
}

function getDefaultScale() {
  return d3Scale.scaleLinear();
}

function getScaleFromProps(props, axis) {
  if (!isScaleDefined(props, axis)) {
    return undefined;
  }
  var scale = props.scale[axis] || props.scale;

  if (validScale(scale)) {
    return (0, _isFunction3.default)(scale) ? scale : d3Scale[toNewName(scale)]();
  }
  return undefined;
}

function getScaleType(props, axis) {
  // if the scale was not given in props, it will be set to linear or time depending on data
  return getScaleTypeFromProps(props, axis) || getScaleTypeFromData(props, axis);
}

function getType(scale) {
  var duckTypes = [{ name: "log", method: "base" }, { name: "ordinal", method: "unknown" }, { name: "pow-sqrt", method: "exponent" }, { name: "quantile", method: "quantiles" }, { name: "quantize-threshold", method: "invertExtent" }];
  var scaleType = duckTypes.filter(function (type) {
    return scale[type.method] !== undefined;
  })[0];
  return scaleType ? scaleType.name : undefined;
}

exports.default = {
  getBaseScale: getBaseScale,
  getDefaultScale: getDefaultScale,
  getScaleFromProps: getScaleFromProps,
  getScaleType: getScaleType,
  getType: getType
};