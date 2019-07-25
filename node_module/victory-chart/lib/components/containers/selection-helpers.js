Object.defineProperty(exports, "__esModule", {
  value: true
});

var _includes2 = require("lodash/includes");

var _includes3 = _interopRequireDefault(_includes2);

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _throttle2 = require("lodash/throttle");

var _throttle3 = _interopRequireDefault(_throttle2);

var _defaults2 = require("lodash/defaults");

var _defaults3 = _interopRequireDefault(_defaults2);

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _victoryCore = require("victory-core");

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SelectionHelpers = {
  getDatasets: function (props) {
    if (props.data) {
      return [{ data: props.data }];
    }

    var getData = function (childProps) {
      var data = _victoryCore.Data.getData(childProps);
      return Array.isArray(data) && data.length > 0 ? data : undefined;
    };

    var iteratee = function (child, childName, parent) {
      var role = child.type && child.type.role;
      var blacklist = props.selectionBlacklist || [];
      if (role === "axis" || role === "legend" || role === "label") {
        return null;
      } else if ((0, _includes3.default)(blacklist, childName)) {
        return null;
      } else if (child.type && (0, _isFunction3.default)(child.type.getData)) {
        child = parent ? _react2.default.cloneElement(child, parent.props) : child;
        var childData = child.props && child.type.getData(child.props);
        return childData ? { childName: childName, data: childData } : null;
      } else {
        var _childData = getData(child.props);
        return _childData ? { childName: childName, data: _childData } : null;
      }
    };
    return _victoryCore.Helpers.reduceChildren(_react2.default.Children.toArray(props.children), iteratee, props);
  },
  filterDatasets: function (props, datasets, bounds) {
    var _this = this;

    var filtered = datasets.reduce(function (memo, dataset) {
      var selectedData = _this.getSelectedData(props, dataset.data, bounds);
      memo = selectedData ? memo.concat({
        childName: dataset.childName, eventKey: selectedData.eventKey, data: selectedData.data
      }) : memo;
      return memo;
    }, []);
    return filtered.length ? filtered : null;
  },
  getPoint: function (props, point) {
    if (!props.horizontal) {
      return point;
    }
    return {
      _x: point._y, _y: point._x, _x1: point._y1, _y1: point._x1, _x0: point._y0, _y0: point._x0
    };
  },
  getSelectedData: function (props, dataset) {
    var _this2 = this;

    var x1 = props.x1,
        y1 = props.y1,
        x2 = props.x2,
        y2 = props.y2;

    var withinBounds = function (d) {
      var point = _this2.getPoint(props, d);
      var scaledPoint = _victoryCore.Helpers.scalePoint(props, point);
      return scaledPoint.x >= Math.min(x1, x2) && scaledPoint.x <= Math.max(x1, x2) && scaledPoint.y >= Math.min(y1, y2) && scaledPoint.y <= Math.max(y1, y2);
    };
    var eventKey = [];
    var data = [];
    var count = 0;
    for (var index = 0, len = dataset.length; index < len; index++) {
      var datum = dataset[index];
      if (withinBounds(datum)) {
        data[count] = datum;
        eventKey[count] = datum.eventKey === undefined ? index : datum.eventKey;
        count++;
      }
    }
    return count > 0 ? { eventKey: eventKey, data: data } : null;
  },


  // eslint-disable-next-line complexity, max-statements
  onMouseDown: function (evt, targetProps) {
    evt.preventDefault();
    var activateSelectedData = targetProps.activateSelectedData,
        allowSelection = targetProps.allowSelection,
        polar = targetProps.polar,
        selectedData = targetProps.selectedData;

    if (!allowSelection) {
      return {};
    }
    var dimension = targetProps.selectionDimension;
    var parentSVG = targetProps.parentSVG || _victoryCore.Selection.getParentSVG(evt);

    var _Selection$getSVGEven = _victoryCore.Selection.getSVGEventCoordinates(evt, parentSVG),
        x = _Selection$getSVGEven.x,
        y = _Selection$getSVGEven.y;

    var x1 = polar || dimension !== "y" ? x : _victoryCore.Selection.getDomainCoordinates(targetProps).x[0];
    var y1 = polar || dimension !== "x" ? y : _victoryCore.Selection.getDomainCoordinates(targetProps).y[0];
    var x2 = polar || dimension !== "y" ? x : _victoryCore.Selection.getDomainCoordinates(targetProps).x[1];
    var y2 = polar || dimension !== "x" ? y : _victoryCore.Selection.getDomainCoordinates(targetProps).y[1];

    var mutatedProps = { x1: x1, y1: y1, select: true, x2: x2, y2: y2, parentSVG: parentSVG };
    if (selectedData && (0, _isFunction3.default)(targetProps.onSelectionCleared)) {
      targetProps.onSelectionCleared((0, _defaults3.default)({}, mutatedProps, targetProps));
    }
    var parentMutation = [{ target: "parent", mutation: function () {
        return mutatedProps;
      } }];
    var dataMutation = selectedData && activateSelectedData ? selectedData.map(function (d) {
      return {
        childName: d.childName, eventKey: d.eventKey, target: "data", mutation: function () {
          return null;
        }
      };
    }) : [];

    return parentMutation.concat.apply(parentMutation, _toConsumableArray(dataMutation));
  },
  onMouseMove: function (evt, targetProps) {
    var allowSelection = targetProps.allowSelection,
        select = targetProps.select,
        polar = targetProps.polar;

    var dimension = targetProps.selectionDimension;
    if (!allowSelection || !select) {
      return null;
    } else {
      var parentSVG = targetProps.parentSVG || _victoryCore.Selection.getParentSVG(evt);

      var _Selection$getSVGEven2 = _victoryCore.Selection.getSVGEventCoordinates(evt, parentSVG),
          x = _Selection$getSVGEven2.x,
          y = _Selection$getSVGEven2.y;

      var x2 = polar || dimension !== "y" ? x : _victoryCore.Selection.getDomainCoordinates(targetProps).x[1];
      var y2 = polar || dimension !== "x" ? y : _victoryCore.Selection.getDomainCoordinates(targetProps).y[1];
      return {
        target: "parent",
        mutation: function () {
          return { x2: x2, y2: y2, parentSVG: parentSVG };
        }
      };
    }
  },
  onMouseUp: function (evt, targetProps) {
    var activateSelectedData = targetProps.activateSelectedData,
        allowSelection = targetProps.allowSelection,
        x2 = targetProps.x2,
        y2 = targetProps.y2;

    if (!allowSelection) {
      return null;
    }
    if (!x2 || !y2) {
      return [{
        target: "parent",
        mutation: function () {
          return { select: false, x1: null, x2: null, y1: null, y2: null };
        }
      }];
    }
    var datasets = this.getDatasets(targetProps);
    var bounds = _victoryCore.Selection.getBounds(targetProps);
    var selectedData = this.filterDatasets(targetProps, datasets, bounds);
    var mutatedProps = {
      selectedData: selectedData, datasets: datasets, select: false, x1: null, x2: null, y1: null, y2: null
    };
    var callbackMutation = selectedData && (0, _isFunction3.default)(targetProps.onSelection) ? targetProps.onSelection(selectedData, bounds, (0, _defaults3.default)({}, mutatedProps, targetProps)) : {};
    var parentMutation = [{
      target: "parent",
      mutation: function () {
        return mutatedProps;
      }
    }];

    var dataMutation = selectedData && activateSelectedData ? selectedData.map(function (d) {
      return {
        childName: d.childName, eventKey: d.eventKey, target: "data",
        mutation: function () {
          return (0, _assign3.default)({ active: true }, callbackMutation);
        }
      };
    }) : [];

    return parentMutation.concat(dataMutation);
  }
};

exports.default = _extends({}, SelectionHelpers, {
  onMouseDown: SelectionHelpers.onMouseDown.bind(SelectionHelpers),
  onMouseUp: SelectionHelpers.onMouseUp.bind(SelectionHelpers),
  onMouseMove: (0, _throttle3.default)(SelectionHelpers.onMouseMove.bind(SelectionHelpers), 16, // eslint-disable-line no-magic-numbers
  { leading: true, trailing: false })
});