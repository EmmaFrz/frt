Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isEmpty2 = require("lodash/isEmpty");

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _without2 = require("lodash/without");

var _without3 = _interopRequireDefault(_without2);

var _pick2 = require("lodash/pick");

var _pick3 = _interopRequireDefault(_pick2);

var _isFunction2 = require("lodash/isFunction");

var _isFunction3 = _interopRequireDefault(_isFunction2);

var _keys2 = require("lodash/keys");

var _keys3 = _interopRequireDefault(_keys2);

var _assign2 = require("lodash/assign");

var _assign3 = _interopRequireDefault(_assign2);

var _defaults2 = require("lodash/defaults");

var _defaults3 = _interopRequireDefault(_defaults2);

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _events = require("./events");

var _events2 = _interopRequireDefault(_events);

var _reactFastCompare = require("react-fast-compare");

var _reactFastCompare2 = _interopRequireDefault(_reactFastCompare);

var _victoryTransition = require("../victory-transition/victory-transition");

var _victoryTransition2 = _interopRequireDefault(_victoryTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//  used for checking state changes. Expected components can be passed in via options
var defaultComponents = [{ name: "parent", index: "parent" }, { name: "data" }, { name: "labels" }];

exports.default = function (WrappedComponent, options) {
  return function (_WrappedComponent) {
    _inherits(addEvents, _WrappedComponent);

    function addEvents(props) {
      _classCallCheck(this, addEvents);

      var _this = _possibleConstructorReturn(this, (addEvents.__proto__ || Object.getPrototypeOf(addEvents)).call(this, props));

      var getScopedEvents = _events2.default.getScopedEvents.bind(_this);
      var boundGetEvents = _events2.default.getEvents.bind(_this);
      _this.state = {};
      _this.getEvents = function (p, target, eventKey) {
        return boundGetEvents(p, target, eventKey, getScopedEvents);
      };
      _this.getEventState = _events2.default.getEventState.bind(_this);
      var calculatedValues = _this.getCalculatedValues(props);
      _this.cacheValues(calculatedValues);
      _this.externalMutations = _this.getExternalMutations(props);
      return _this;
    }

    _createClass(addEvents, [{
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        var externalMutations = this.getExternalMutations(this.props);
        if (!(0, _reactFastCompare2.default)(this.externalMutations, externalMutations)) {
          this.externalMutations = externalMutations;
          this.applyExternalMutations(this.props, externalMutations);
        }
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        this.cacheValues(this.getCalculatedValues(nextProps));
      }
    }, {
      key: "applyExternalMutations",
      value: function applyExternalMutations(props, externalMutations) {
        if (!(0, _isEmpty3.default)(externalMutations)) {
          var callbacks = props.externalEventMutations.reduce(function (memo, mutation) {
            memo = (0, _isFunction3.default)(mutation.callback) ? memo.concat(mutation.callback) : memo;
            return memo;
          }, []);
          var compiledCallbacks = callbacks.length ? function () {
            callbacks.forEach(function (c) {
              return c();
            });
          } : undefined;
          this.setState(externalMutations, compiledCallbacks);
        }
      }

      // compile all state changes from own and parent state. Order doesn't matter, as any state
      // state change should trigger a re-render

    }, {
      key: "getStateChanges",
      value: function getStateChanges(props, calculatedValues) {
        var _this2 = this;

        var hasEvents = calculatedValues.hasEvents,
            getSharedEventState = calculatedValues.getSharedEventState;

        if (!hasEvents) {
          return {};
        }

        options = options || {};
        var components = options.components || defaultComponents;

        var getState = function (key, type) {
          var baseState = (0, _defaults3.default)({}, _this2.getEventState(key, type), getSharedEventState(key, type));
          return (0, _isEmpty3.default)(baseState) ? undefined : baseState;
        };

        return components.map(function (component) {
          if (!props.standalone && component.name === "parent") {
            // don't check for changes on parent props for non-standalone components
            return undefined;
          } else {
            return component.index !== undefined ? getState(component.index, component.name) : calculatedValues.dataKeys.map(function (key) {
              return getState(key, component.name);
            });
          }
        }).filter(Boolean);
      }
    }, {
      key: "getCalculatedValues",
      value: function getCalculatedValues(props) {
        var sharedEvents = props.sharedEvents;

        var components = WrappedComponent.expectedComponents;
        var componentEvents = _events2.default.getComponentEvents(props, components);
        var getSharedEventState = sharedEvents && (0, _isFunction3.default)(sharedEvents.getEventState) ? sharedEvents.getEventState : function () {
          return undefined;
        };
        var baseProps = this.getBaseProps(props, getSharedEventState);
        var dataKeys = (0, _keys3.default)(baseProps).filter(function (key) {
          return key !== "parent";
        });
        var hasEvents = props.events || props.sharedEvents || componentEvents;
        var events = this.getAllEvents(props);
        return {
          componentEvents: componentEvents, getSharedEventState: getSharedEventState, baseProps: baseProps, dataKeys: dataKeys,
          hasEvents: hasEvents, events: events
        };
      }
    }, {
      key: "getExternalMutations",
      value: function getExternalMutations(props) {
        var sharedEvents = props.sharedEvents,
            externalEventMutations = props.externalEventMutations;

        return (0, _isEmpty3.default)(externalEventMutations) || sharedEvents ? undefined : _events2.default.getExternalMutations(externalEventMutations, this.baseProps, this.state);
      }
    }, {
      key: "cacheValues",
      value: function cacheValues(obj) {
        var _this3 = this;

        (0, _keys3.default)(obj).forEach(function (key) {
          _this3[key] = obj[key];
        });
      }
    }, {
      key: "getBaseProps",
      value: function getBaseProps(props, getSharedEventState) {
        getSharedEventState = getSharedEventState || this.getSharedEventState;
        var sharedParentState = getSharedEventState("parent", "parent");
        var parentState = this.getEventState("parent", "parent");
        var baseParentProps = (0, _defaults3.default)({}, parentState, sharedParentState);
        var parentPropsList = baseParentProps.parentControlledProps;
        var parentProps = parentPropsList ? (0, _pick3.default)(baseParentProps, parentPropsList) : {};
        var modifiedProps = (0, _defaults3.default)({}, parentProps, props);
        return (0, _isFunction3.default)(WrappedComponent.getBaseProps) ? WrappedComponent.getBaseProps(modifiedProps) : {};
      }
    }, {
      key: "getAllEvents",
      value: function getAllEvents(props) {
        if (Array.isArray(this.componentEvents)) {
          var _componentEvents;

          return Array.isArray(props.events) ? (_componentEvents = this.componentEvents).concat.apply(_componentEvents, _toConsumableArray(props.events)) : this.componentEvents;
        }
        return props.events;
      }
    }, {
      key: "getComponentProps",
      value: function getComponentProps(component, type, index) {
        var role = WrappedComponent.role;

        var key = this.dataKeys && this.dataKeys[index] || index;
        var baseProps = this.baseProps[key] && this.baseProps[key][type] || this.baseProps[key];
        if (!baseProps && !this.hasEvents) {
          return undefined;
        }
        if (this.hasEvents) {
          var baseEvents = this.getEvents(this.props, type, key);
          var componentProps = (0, _defaults3.default)({ index: index, key: role + "-" + type + "-" + key }, this.getEventState(key, type), this.getSharedEventState(key, type), component.props, baseProps);
          var events = (0, _defaults3.default)({}, _events2.default.getPartialEvents(baseEvents, key, componentProps), componentProps.events);
          return (0, _assign3.default)({}, componentProps, { events: events });
        }
        return (0, _defaults3.default)({ index: index, key: role + "-" + type + "-" + key }, component.props, baseProps);
      }
    }, {
      key: "renderContainer",
      value: function renderContainer(component, children) {
        var isContainer = component.type && component.type.role === "container";
        var parentProps = isContainer ? this.getComponentProps(component, "parent", "parent") : {};
        return _react2.default.cloneElement(component, parentProps, children);
      }
    }, {
      key: "animateComponent",
      value: function animateComponent(props, animationWhitelist) {
        return _react2.default.createElement(
          _victoryTransition2.default,
          { animate: props.animate, animationWhitelist: animationWhitelist },
          _react2.default.createElement(this.constructor, props)
        );
      }

      // Used by `VictoryLine` and `VictoryArea`

    }, {
      key: "renderContinuousData",
      value: function renderContinuousData(props) {
        var _this4 = this;

        var dataComponent = props.dataComponent,
            labelComponent = props.labelComponent,
            groupComponent = props.groupComponent;

        var dataKeys = (0, _without3.default)(this.dataKeys, "all");
        var labelComponents = dataKeys.reduce(function (memo, key) {
          var labelProps = _this4.getComponentProps(labelComponent, "labels", key);
          if (labelProps && labelProps.text !== undefined && labelProps.text !== null) {
            memo = memo.concat(_react2.default.cloneElement(labelComponent, labelProps));
          }
          return memo;
        }, []);
        var dataProps = this.getComponentProps(dataComponent, "data", "all");
        var children = [_react2.default.cloneElement(dataComponent, dataProps)].concat(_toConsumableArray(labelComponents));
        return this.renderContainer(groupComponent, children);
      }
    }, {
      key: "renderData",
      value: function renderData(props) {
        var _this5 = this;

        var dataComponent = props.dataComponent,
            labelComponent = props.labelComponent,
            groupComponent = props.groupComponent;

        var dataComponents = this.dataKeys.map(function (_dataKey, index) {
          var dataProps = _this5.getComponentProps(dataComponent, "data", index);
          return _react2.default.cloneElement(dataComponent, dataProps);
        });

        var labelComponents = this.dataKeys.map(function (_dataKey, index) {
          var labelProps = _this5.getComponentProps(labelComponent, "labels", index);
          if (labelProps.text !== undefined && labelProps.text !== null) {
            return _react2.default.cloneElement(labelComponent, labelProps);
          }
          return undefined;
        }).filter(Boolean);

        var children = [].concat(_toConsumableArray(dataComponents), _toConsumableArray(labelComponents));
        return this.renderContainer(groupComponent, children);
      }
    }]);

    return addEvents;
  }(WrappedComponent);
};