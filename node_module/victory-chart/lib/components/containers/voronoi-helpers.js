Object.defineProperty(exports, "__esModule", {
  value: true
});

var _includes2 = require("lodash/includes");

var _includes3 = _interopRequireDefault(_includes2);

var _keys2 = require("lodash/keys");

var _keys3 = _interopRequireDefault(_keys2);

var _groupBy2 = require("lodash/groupBy");

var _groupBy3 = _interopRequireDefault(_groupBy2);

var _isEmpty2 = require("lodash/isEmpty");

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _throttle2 = require("lodash/throttle");

var _throttle3 = _interopRequireDefault(_throttle2);

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _victoryCore = require("victory-core");

var _reactFastCompare = require("react-fast-compare");

var _reactFastCompare2 = _interopRequireDefault(_reactFastCompare);

var _d3Voronoi = require("d3-voronoi");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var VoronoiHelpers = {
  withinBounds: function (props, point) {
    var width = props.width,
        height = props.height,
        voronoiPadding = props.voronoiPadding,
        polar = props.polar,
        origin = props.origin,
        scale = props.scale;

    var padding = voronoiPadding || 0;
    var x = point.x,
        y = point.y;

    if (polar) {
      var distanceSquared = Math.pow(x - origin.x, 2) + Math.pow(y - origin.y, 2);
      var radius = Math.max.apply(Math, _toConsumableArray(scale.y.range()));
      return distanceSquared < Math.pow(radius, 2);
    } else {
      return x >= padding && x <= width - padding && y >= padding && y <= height - padding;
    }
  },
  getDatasets: function (props) {
    var children = _react2.default.Children.toArray(props.children);
    var addMeta = function (data, name, child) {
      var continuous = child && child.type && child.type.continuous;
      var style = child ? child.props && child.props.style : props.style;
      return data.map(function (datum, index) {
        var _Helpers$getPoint = _victoryCore.Helpers.getPoint(datum),
            x = _Helpers$getPoint.x,
            y = _Helpers$getPoint.y,
            y0 = _Helpers$getPoint.y0,
            x0 = _Helpers$getPoint.x0;

        var voronoiX = props.horizontal ? (y + y0) / 2 : (x + x0) / 2;
        var voronoiY = props.horizontal ? (x + x0) / 2 : (y + y0) / 2;
        return (0, _assign3.default)({
          _voronoiX: props.voronoiDimension === "y" ? 0 : voronoiX,
          _voronoiY: props.voronoiDimension === "x" ? 0 : voronoiY,
          eventKey: index,
          childName: name,
          continuous: continuous, style: style
        }, datum);
      });
    };

    if (props.data) {
      return addMeta(props.data);
    }

    var getData = function (childProps) {
      var data = _victoryCore.Data.getData(childProps);
      return Array.isArray(data) && data.length > 0 ? data : undefined;
    };

    var iteratee = function (child, childName) {
      var skippedRoles = ["axis", "legend", "label"];
      var role = child.type && child.type.role;
      var childProps = child.props || {};
      var name = childProps.name || childName;
      var blacklist = props.voronoiBlacklist || [];
      if ((0, _includes3.default)(skippedRoles, role) || (0, _includes3.default)(blacklist, name)) {
        return null;
      }
      var getChildData = child.type && (0, _isFunction3.default)(child.type.getData) ? child.type.getData : getData;
      var childData = getChildData(child.props);
      return childData ? addMeta(childData, name, child) : null;
    };

    return _victoryCore.Helpers.reduceChildren(children, iteratee, props);
  },


  // returns an array of objects with point and data where point is an x, y coordinate, and data is
  // an array of points belonging to that coordinate
  mergeDatasets: function (props, datasets) {
    var points = (0, _groupBy3.default)(datasets, function (datum) {
      var _Helpers$scalePoint = _victoryCore.Helpers.scalePoint(props, datum),
          x = _Helpers$scalePoint.x,
          y = _Helpers$scalePoint.y;

      return x + "," + y;
    });
    return (0, _keys3.default)(points).map(function (key) {
      var point = key.split(",");
      return {
        x: +point[0],
        y: +point[1],
        points: points[key]
      };
    });
  },
  getVoronoi: function (props, mousePosition) {
    var width = props.width,
        height = props.height,
        voronoiPadding = props.voronoiPadding;

    var padding = voronoiPadding || 0;
    var voronoiFunction = (0, _d3Voronoi.voronoi)().x(function (d) {
      return d.x;
    }).y(function (d) {
      return d.y;
    }).extent([[padding, padding], [width - padding, height - padding]]);
    var datasets = this.getDatasets(props);
    var voronoi = voronoiFunction(this.mergeDatasets(props, datasets));
    var size = props.voronoiDimension ? undefined : props.radius;
    return voronoi.find(mousePosition.x, mousePosition.y, size);
  },
  getActiveMutations: function (props, point) {
    var childName = point.childName,
        continuous = point.continuous;
    var activateData = props.activateData,
        activateLabels = props.activateLabels,
        labels = props.labels;

    if (!activateData && !activateLabels) {
      return [];
    }
    var defaultTarget = activateData ? ["data"] : [];
    var targets = labels && !activateLabels ? defaultTarget : defaultTarget.concat("labels");
    if ((0, _isEmpty3.default)(targets)) {
      return [];
    }
    return targets.map(function (target) {
      var eventKey = continuous === true && target === "data" ? "all" : point.eventKey;
      return {
        childName: childName, eventKey: eventKey, target: target, mutation: function () {
          return { active: true };
        }
      };
    });
  },
  getInactiveMutations: function (props, point) {
    var childName = point.childName,
        continuous = point.continuous;
    var activateData = props.activateData,
        activateLabels = props.activateLabels,
        labels = props.labels;

    if (!activateData && !activateLabels) {
      return [];
    }
    var defaultTarget = activateData ? ["data"] : [];
    var targets = labels && !activateLabels ? defaultTarget : defaultTarget.concat("labels");
    if ((0, _isEmpty3.default)(targets)) {
      return [];
    }
    return targets.map(function (target) {
      var eventKey = continuous && target === "data" ? "all" : point.eventKey;
      return {
        childName: childName, eventKey: eventKey, target: target, mutation: function () {
          return null;
        }
      };
    });
  },
  getParentMutation: function (activePoints, mousePosition, parentSVG) {
    return [{
      target: "parent",
      eventKey: "parent",
      mutation: function () {
        return { activePoints: activePoints, mousePosition: mousePosition, parentSVG: parentSVG };
      }
    }];
  },
  onActivated: function (props, points) {
    if ((0, _isFunction3.default)(props.onActivated)) {
      props.onActivated(points, props);
    }
  },
  onDeactivated: function (props, points) {
    if ((0, _isFunction3.default)(props.onDeactivated)) {
      props.onDeactivated(points, props);
    }
  },
  onMouseLeave: function (evt, targetProps) {
    var _this = this,
        _getParentMutation;

    var activePoints = targetProps.activePoints || [];
    this.onDeactivated(targetProps, activePoints);
    var inactiveMutations = activePoints.length ? activePoints.map(function (point) {
      return _this.getInactiveMutations(targetProps, point);
    }) : [];
    return (_getParentMutation = this.getParentMutation([])).concat.apply(_getParentMutation, _toConsumableArray(inactiveMutations));
  },
  onMouseMove: function (evt, targetProps) {
    var _this2 = this;

    // eslint-disable-line max-statements
    var activePoints = targetProps.activePoints || [];
    var parentSVG = targetProps.parentSVG || _victoryCore.Selection.getParentSVG(evt);
    var mousePosition = _victoryCore.Selection.getSVGEventCoordinates(evt, parentSVG);
    if (!this.withinBounds(targetProps, mousePosition)) {
      var _getParentMutation2;

      this.onDeactivated(targetProps, activePoints);
      var inactiveMutations = activePoints.length ? activePoints.map(function (point) {
        return _this2.getInactiveMutations(targetProps, point);
      }) : [];
      return (_getParentMutation2 = this.getParentMutation([], mousePosition, parentSVG)).concat.apply(_getParentMutation2, _toConsumableArray(inactiveMutations));
    }
    var nearestVoronoi = this.getVoronoi(targetProps, mousePosition);
    var points = nearestVoronoi ? nearestVoronoi.data.points : [];
    var parentMutations = this.getParentMutation(points, mousePosition, parentSVG);
    if (activePoints.length && (0, _reactFastCompare2.default)(points, activePoints)) {
      return parentMutations;
    } else {
      this.onActivated(targetProps, points);
      this.onDeactivated(targetProps, activePoints);
      var activeMutations = points.length ? points.map(function (point) {
        return _this2.getActiveMutations(targetProps, point);
      }) : [];
      var _inactiveMutations = activePoints.length ? activePoints.map(function (point) {
        return _this2.getInactiveMutations(targetProps, point);
      }) : [];
      return parentMutations.concat.apply(parentMutations, _toConsumableArray(_inactiveMutations).concat(_toConsumableArray(activeMutations)));
    }
  }
};

exports.default = {
  onMouseLeave: VoronoiHelpers.onMouseLeave.bind(VoronoiHelpers),
  onMouseMove: (0, _throttle3.default)(VoronoiHelpers.onMouseMove.bind(VoronoiHelpers), 32, // eslint-disable-line no-magic-numbers
  { leading: true, trailing: false })
};