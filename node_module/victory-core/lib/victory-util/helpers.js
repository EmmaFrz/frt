Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _pick2 = require("lodash/pick");

var _pick3 = _interopRequireDefault(_pick2);

var _property2 = require("lodash/property");

var _property3 = _interopRequireDefault(_property2);

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _defaults2 = require("lodash/defaults");

var _defaults3 = _interopRequireDefault(_defaults2);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Private Functions

function getCartesianRange(props, axis) {
  // determine how to lay the axis and what direction positive and negative are
  var vertical = axis !== "x";
  var padding = getPadding(props);
  if (vertical) {
    return [props.height - padding.bottom, padding.top];
  }
  return [padding.left, props.width - padding.right];
} /* eslint-disable func-style */
/* eslint-disable no-use-before-define */


function getPolarRange(props, axis) {
  if (axis === "x") {
    var startAngle = degreesToRadians(props.startAngle || 0);
    var endAngle = degreesToRadians(props.endAngle || 360);
    return [startAngle, endAngle];
  }
  return [props.innerRadius || 0, getRadius(props)];
}

// Exported Functions

/**
 * creates an object with some keys excluded
 * replacement for lodash.omit for performance. does not mimick the entire lodash.omit api
 * @param {Object} originalObject: created object will be based on this object
 * @param {Array<String>} keys: an array of keys to omit from the new object
 * @returns {Object} new object with same properties as originalObject
 */
function omit(originalObject) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  // code based on babel's _objectWithoutProperties
  var newObject = {};
  for (var key in originalObject) {
    if (keys.indexOf(key) >= 0) {
      continue;
    }
    if (!Object.prototype.hasOwnProperty.call(originalObject, key)) {
      continue;
    }
    newObject[key] = originalObject[key];
  }
  return newObject;
}

function getPoint(datum) {
  var exists = function (val) {
    return val !== undefined;
  };
  var _x = datum._x,
      _x1 = datum._x1,
      _x0 = datum._x0,
      _voronoiX = datum._voronoiX,
      _y = datum._y,
      _y1 = datum._y1,
      _y0 = datum._y0,
      _voronoiY = datum._voronoiY;

  var defaultX = exists(_x1) ? _x1 : _x;
  var defaultY = exists(_y1) ? _y1 : _y;
  var point = {
    x: exists(_voronoiX) ? _voronoiX : defaultX,
    x0: exists(_x0) ? _x0 : _x,
    y: exists(_voronoiY) ? _voronoiY : defaultY,
    y0: exists(_y0) ? _y0 : _y
  };
  return (0, _defaults3.default)({}, point, datum);
}

function scalePoint(props, datum) {
  var scale = props.scale,
      polar = props.polar;

  var d = getPoint(datum);
  var origin = props.origin || { x: 0, y: 0 };
  var x = scale.x(d.x);
  var x0 = scale.x(d.x0);
  var y = scale.y(d.y);
  var y0 = scale.y(d.y0);
  return {
    x: polar ? y * Math.cos(x) + origin.x : x,
    x0: polar ? y0 * Math.cos(x0) + origin.x : x0,
    y: polar ? -y * Math.sin(x) + origin.y : y,
    y0: polar ? -y0 * Math.sin(x0) + origin.x : y0
  };
}

function getPadding(props) {
  var padding = props.padding;

  var paddingVal = typeof padding === "number" ? padding : 0;
  var paddingObj = typeof padding === "object" ? padding : {};
  return {
    top: paddingObj.top || paddingVal,
    bottom: paddingObj.bottom || paddingVal,
    left: paddingObj.left || paddingVal,
    right: paddingObj.right || paddingVal
  };
}

function getStyles(style, defaultStyles) {
  var width = "100%";
  var height = "100%";
  if (!style) {
    return (0, _defaults3.default)({ parent: { height: height, width: width } }, defaultStyles);
  }
  var data = style.data,
      labels = style.labels,
      parent = style.parent;

  var defaultParent = defaultStyles && defaultStyles.parent || {};
  var defaultLabels = defaultStyles && defaultStyles.labels || {};
  var defaultData = defaultStyles && defaultStyles.data || {};
  return {
    parent: (0, _defaults3.default)({}, parent, defaultParent, { width: width, height: height }),
    labels: (0, _defaults3.default)({}, labels, defaultLabels),
    data: (0, _defaults3.default)({}, data, defaultData)
  };
}

function evaluateProp(prop, data, active) {
  return (0, _isFunction3.default)(prop) ? prop(data, active) : prop;
}

function evaluateStyle(style, data, active) {
  if (!style || !Object.keys(style).some(function (value) {
    return (0, _isFunction3.default)(style[value]);
  })) {
    return style;
  }
  return Object.keys(style).reduce(function (prev, curr) {
    prev[curr] = evaluateProp(style[curr], data, active);
    return prev;
  }, {});
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function radiansToDegrees(radians) {
  return radians / (Math.PI / 180);
}

function getRadius(props) {
  var _getPadding = getPadding(props),
      left = _getPadding.left,
      right = _getPadding.right,
      top = _getPadding.top,
      bottom = _getPadding.bottom;

  var width = props.width,
      height = props.height;

  return Math.min(width - left - right, height - top - bottom) / 2;
}

function getPolarOrigin(props) {
  var width = props.width,
      height = props.height;

  var _getPadding2 = getPadding(props),
      top = _getPadding2.top,
      bottom = _getPadding2.bottom,
      left = _getPadding2.left,
      right = _getPadding2.right;

  var radius = Math.min(width - left - right, height - top - bottom) / 2;
  var offsetWidth = width / 2 + left - right;
  var offsetHeight = height / 2 + top - bottom;
  return {
    x: offsetWidth + radius > width ? radius + left - right : offsetWidth,
    y: offsetHeight + radius > height ? radius + top - bottom : offsetHeight
  };
}

function getRange(props, axis) {
  if (props.range && props.range[axis]) {
    return props.range[axis];
  } else if (props.range && Array.isArray(props.range)) {
    return props.range;
  }
  return props.polar ? getPolarRange(props, axis) : getCartesianRange(props, axis);
}

function createAccessor(key) {
  // creates a data accessor function
  // given a property key, path, array index, or null for identity.
  if ((0, _isFunction3.default)(key)) {
    return key;
  } else if (key === null || key === undefined) {
    // null/undefined means "return the data item itself"
    return function (x) {
      return x;
    };
  }
  // otherwise, assume it is an array index, property key or path (_.property handles all three)
  return (0, _property3.default)(key);
}

function modifyProps(props, fallbackProps, role) {
  var theme = props.theme && props.theme[role] ? props.theme[role] : {};
  var themeProps = omit(theme, ["style"]);
  return (0, _defaults3.default)({}, props, themeProps, fallbackProps);
}

/**
 * Returns the given axis or the opposite axis when horizontal
 * @param {string} axis: the given axis, either "x" pr "y"
 * @param {Boolean} horizontal: true when the chart is flipped to the horizontal orientation
 * @returns {String} the dimension appropriate for the axis given its props "x" or "y"
 */
function getCurrentAxis(axis, horizontal) {
  var otherAxis = axis === "x" ? "y" : "x";
  return horizontal ? otherAxis : axis;
}

/**
 * @param {Array} children: an array of child components
 * @param {Function} iteratee: a function with arguments "child", "childName", and "parent"
 * @param {Object} parentProps: props from the parent that are applied to children
 * @returns {Array} returns an array of results from calling the iteratee on all nested children
 */
function reduceChildren(children, iteratee) {
  var parentProps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var sharedProps = ["data", "domain", "categories", "polar", "startAngle", "endAngle", "minDomain", "maxDomain"];
  var traverseChildren = function (childArray, names, parent) {
    return childArray.reduce(function (memo, child, index) {
      var childRole = child.type && child.type.role;
      var childName = child.props.name || childRole + "-" + names[index];
      if (child.props && child.props.children) {
        var childProps = (0, _assign3.default)({}, child.props, (0, _pick3.default)(parentProps, sharedProps));
        var nestedChildren = child.type && (0, _isFunction3.default)(child.type.getChildren) ? child.type.getChildren(childProps) : _react2.default.Children.toArray(child.props.children).map(function (c) {
          var nestedChildProps = (0, _assign3.default)({}, c.props, (0, _pick3.default)(childProps, sharedProps));
          return _react2.default.cloneElement(c, nestedChildProps);
        });
        var _childNames = nestedChildren.map(function (c, i) {
          return childName + "-" + i;
        });
        var nestedResults = traverseChildren(nestedChildren, _childNames, child);
        memo = memo.concat(nestedResults);
      } else {
        var result = iteratee(child, childName, parent);
        memo = result ? memo.concat(result) : memo;
      }
      return memo;
    }, []);
  };
  var childNames = children.map(function (c, i) {
    return i;
  });
  return traverseChildren(children, childNames);
}

exports.default = {
  omit: omit,
  getPoint: getPoint,
  scalePoint: scalePoint,
  getPadding: getPadding,
  getStyles: getStyles,
  evaluateProp: evaluateProp,
  evaluateStyle: evaluateStyle,
  degreesToRadians: degreesToRadians,
  radiansToDegrees: radiansToDegrees,
  getRadius: getRadius,
  getPolarOrigin: getPolarOrigin,
  getRange: getRange,
  createAccessor: createAccessor,
  modifyProps: modifyProps,
  getCurrentAxis: getCurrentAxis,
  reduceChildren: reduceChildren
};