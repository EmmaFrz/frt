function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) {
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  }

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
  }
  return t;
};

import classNames from 'classnames';
import toArray from "rc-util/es/Children/toArray";
import KeyCode from "rc-util/es/KeyCode";
import * as React from 'react';
import { polyfill } from 'react-lifecycles-compat';
import KeywordTrigger from './KeywordTrigger';
import { MentionsContextProvider } from './MentionsContext';
import Option from './Option';
import { filterOption as defaultFilterOption, getBeforeSelectionText, getLastMeasureIndex, omit, replaceWithMeasure, setInputSelection, validateSearch as defaultValidateSearch } from './util';

var Mentions =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Mentions, _React$Component);

  function Mentions(props) {
    var _this;

    _classCallCheck(this, Mentions);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Mentions).call(this, props));
    _this.focusId = undefined;

    _this.triggerChange = function (value) {
      var onChange = _this.props.onChange;

      if (!('value' in _this.props)) {
        _this.setState({
          value: value
        });
      }

      if (onChange) {
        onChange(value);
      }
    };

    _this.onChange = function (_ref) {
      var value = _ref.target.value;

      _this.triggerChange(value);
    }; // Check if hit the measure keyword


    _this.onKeyDown = function (event) {
      var which = event.which;
      var _this$state = _this.state,
          activeIndex = _this$state.activeIndex,
          measuring = _this$state.measuring; // Skip if not measuring

      if (!measuring) {
        return;
      }

      if (which === KeyCode.UP || which === KeyCode.DOWN) {
        // Control arrow function
        var optionLen = _this.getOptions().length;

        var offset = which === KeyCode.UP ? -1 : 1;
        var newActiveIndex = (activeIndex + offset + optionLen) % optionLen;

        _this.setState({
          activeIndex: newActiveIndex
        });

        event.preventDefault();
      } else if (which === KeyCode.ESC) {
        _this.stopMeasure();

        return;
      } else if (which === KeyCode.ENTER) {
        // Measure hit
        var option = _this.getOptions()[activeIndex];

        _this.selectOption(option);

        event.preventDefault();
      }
    };
    /**
     * When to start measure:
     * 1. When user press `prefix`
     * 2. When measureText !== prevMeasureText
     *  - If measure hit
     *  - If measuring
     *
     * When to stop measure:
     * 1. Selection is out of range
     * 2. Contains `space`
     * 3. ESC or select one
     */


    _this.onKeyUp = function (event) {
      var key = event.key,
          which = event.which;
      var _this$state2 = _this.state,
          prevMeasureText = _this$state2.measureText,
          measuring = _this$state2.measuring;
      var _this$props = _this.props,
          _this$props$prefix = _this$props.prefix,
          prefix = _this$props$prefix === void 0 ? '' : _this$props$prefix,
          onSearch = _this$props.onSearch,
          validateSearch = _this$props.validateSearch;
      var target = event.target;
      var selectionStartText = getBeforeSelectionText(target);

      var _getLastMeasureIndex = getLastMeasureIndex(selectionStartText, prefix),
          measureIndex = _getLastMeasureIndex.location,
          measurePrefix = _getLastMeasureIndex.prefix; // Skip if match the white key list


      if ([KeyCode.ESC, KeyCode.UP, KeyCode.DOWN, KeyCode.ENTER].indexOf(which) !== -1) {
        return;
      }

      if (measureIndex !== -1) {
        var measureText = selectionStartText.slice(measureIndex + measurePrefix.length);
        var validateMeasure = validateSearch(measureText, _this.props);
        var matchOption = !!_this.getOptions(measureText).length;

        if (validateMeasure) {
          if (key === measurePrefix || measuring || measureText !== prevMeasureText && matchOption) {
            _this.startMeasure(measureText, measurePrefix, measureIndex);
          }
        } else if (measuring) {
          // Stop if measureText is invalidate
          _this.stopMeasure();
        }
        /**
         * We will trigger `onSearch` to developer since they may use for async update.
         * If met `space` means user finished searching.
         */


        if (onSearch && validateMeasure) {
          onSearch(measureText, measurePrefix);
        }
      } else if (measuring) {
        _this.stopMeasure();
      }
    };

    _this.onInputFocus = function (event) {
      _this.onFocus(event);
    };

    _this.onInputBlur = function (event) {
      _this.onBlur(event);
    };

    _this.onDropdownFocus = function () {
      _this.onFocus();
    };

    _this.onFocus = function (event) {
      window.clearTimeout(_this.focusId);
      var isFocus = _this.state.isFocus;
      var onFocus = _this.props.onFocus;

      if (!isFocus && event && onFocus) {
        onFocus(event);
      }

      _this.setState({
        isFocus: true
      });
    };

    _this.onBlur = function (event) {
      _this.focusId = window.setTimeout(function () {
        var onBlur = _this.props.onBlur;

        _this.setState({
          isFocus: false
        });

        _this.stopMeasure();

        if (onBlur) {
          onBlur(event);
        }
      }, 0);
    };

    _this.selectOption = function (option) {
      var _this$state3 = _this.state,
          value = _this$state3.value,
          measureLocation = _this$state3.measureLocation,
          measurePrefix = _this$state3.measurePrefix;
      var _this$props2 = _this.props,
          split = _this$props2.split,
          onSelect = _this$props2.onSelect;
      var _option$value = option.value,
          mentionValue = _option$value === void 0 ? '' : _option$value;

      var _replaceWithMeasure = replaceWithMeasure(value, {
        measureLocation: measureLocation,
        targetText: mentionValue,
        prefix: measurePrefix,
        selectionStart: _this.textarea.selectionStart,
        split: split
      }),
          text = _replaceWithMeasure.text,
          selectionLocation = _replaceWithMeasure.selectionLocation;

      _this.triggerChange(text);

      _this.stopMeasure(function () {
        // We need restore the selection position
        setInputSelection(_this.textarea, selectionLocation);
      });

      if (onSelect) {
        onSelect(option, measurePrefix);
      }
    };

    _this.setActiveIndex = function (activeIndex) {
      _this.setState({
        activeIndex: activeIndex
      });
    };

    _this.setTextAreaRef = function (element) {
      _this.textarea = element;
    };

    _this.setMeasureRef = function (element) {
      _this.measure = element;
    };

    _this.getOptions = function (measureText) {
      var targetMeasureText = measureText || _this.state.measureText || '';
      var _this$props3 = _this.props,
          children = _this$props3.children,
          filterOption = _this$props3.filterOption;
      var list = toArray(children).map(function (_ref2) {
        var props = _ref2.props;
        return props;
      }).filter(function (option) {
        /** Return all result if `filterOption` is false. */
        if (filterOption === false) {
          return true;
        }

        return filterOption(targetMeasureText, option);
      });
      return list;
    };

    _this.state = {
      value: props.defaultValue || props.value || '',
      measuring: false,
      measureLocation: 0,
      measureText: null,
      measurePrefix: '',
      activeIndex: 0,
      isFocus: false
    };
    return _this;
  }

  _createClass(Mentions, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var measuring = this.state.measuring; // Sync measure div top with textarea for rc-trigger usage

      if (measuring) {
        this.measure.scrollTop = this.textarea.scrollTop;
      }
    }
  }, {
    key: "startMeasure",
    value: function startMeasure(measureText, measurePrefix, measureLocation) {
      this.setState({
        measuring: true,
        measureText: measureText,
        measurePrefix: measurePrefix,
        measureLocation: measureLocation,
        activeIndex: 0
      });
    }
  }, {
    key: "stopMeasure",
    value: function stopMeasure(callback) {
      this.setState({
        measuring: false,
        measureLocation: 0,
        measureText: null
      }, callback);
    }
  }, {
    key: "focus",
    value: function focus() {
      this.textarea.focus();
    }
  }, {
    key: "blur",
    value: function blur() {
      this.textarea.blur();
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state4 = this.state,
          value = _this$state4.value,
          measureLocation = _this$state4.measureLocation,
          measurePrefix = _this$state4.measurePrefix,
          measuring = _this$state4.measuring,
          activeIndex = _this$state4.activeIndex;

      var _a = this.props,
          prefixCls = _a.prefixCls,
          placement = _a.placement,
          transitionName = _a.transitionName,
          className = _a.className,
          style = _a.style,
          autoFocus = _a.autoFocus,
          notFoundContent = _a.notFoundContent,
          restProps = __rest(_a, ["prefixCls", "placement", "transitionName", "className", "style", "autoFocus", "notFoundContent"]);

      var inputProps = omit(restProps, 'value', 'defaultValue', 'prefix', 'split', 'children', 'validateSearch', 'filterOption', 'onSelect', 'onSearch');
      var options = measuring ? this.getOptions() : [];
      return React.createElement("div", {
        className: classNames(prefixCls, className),
        style: style
      }, React.createElement("textarea", _extends({
        autoFocus: autoFocus,
        ref: this.setTextAreaRef,
        value: value
      }, inputProps, {
        onChange: this.onChange,
        onKeyDown: this.onKeyDown,
        onKeyUp: this.onKeyUp,
        onFocus: this.onInputFocus,
        onBlur: this.onInputBlur
      })), measuring && React.createElement("div", {
        ref: this.setMeasureRef,
        className: "".concat(prefixCls, "-measure")
      }, value.slice(0, measureLocation), React.createElement(MentionsContextProvider, {
        value: {
          notFoundContent: notFoundContent,
          activeIndex: activeIndex,
          setActiveIndex: this.setActiveIndex,
          selectOption: this.selectOption,
          onFocus: this.onDropdownFocus
        }
      }, React.createElement(KeywordTrigger, {
        prefixCls: prefixCls,
        transitionName: transitionName,
        placement: placement,
        options: options,
        visible: true
      }, React.createElement("span", null, measurePrefix))), value.slice(measureLocation + measurePrefix.length)));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, prevState) {
      var newState = {};

      if ('value' in props && props.value !== prevState.value) {
        newState.value = props.value;
      }

      return newState;
    }
  }]);

  return Mentions;
}(React.Component);

Mentions.Option = Option;
Mentions.defaultProps = {
  prefixCls: 'rc-mentions',
  prefix: '@',
  split: ' ',
  validateSearch: defaultValidateSearch,
  filterOption: defaultFilterOption,
  notFoundContent: 'Not Found',
  rows: 1
};
polyfill(Mentions);
export default Mentions;