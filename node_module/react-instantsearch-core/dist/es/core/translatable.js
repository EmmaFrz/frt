import _extends from "@babel/runtime/helpers/esm/extends";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _assertThisInitialized from "@babel/runtime/helpers/esm/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _has from "lodash/has";
import React, { Component } from 'react';

var withKeysPropType = function withKeysPropType(keys) {
  return function (props, propName, componentName) {
    var prop = props[propName];

    if (prop) {
      for (var _i = 0, _Object$keys = Object.keys(prop); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];

        if (keys.indexOf(key) === -1) {
          return new Error("Unknown `".concat(propName, "` key `").concat(key, "`. Check the render method ") + "of `".concat(componentName, "`."));
        }
      }
    }

    return undefined;
  };
};

export default function translatable(defaultTranslations) {
  return function (Composed) {
    var Translatable =
    /*#__PURE__*/
    function (_Component) {
      _inherits(Translatable, _Component);

      function Translatable() {
        var _getPrototypeOf2;

        var _this;

        _classCallCheck(this, Translatable);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Translatable)).call.apply(_getPrototypeOf2, [this].concat(args)));

        _defineProperty(_assertThisInitialized(_this), "translate", function (key) {
          var translations = _this.props.translations;
          var translation = translations && _has(translations, key) ? translations[key] : defaultTranslations[key];

          if (typeof translation === 'function') {
            for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              params[_key2 - 1] = arguments[_key2];
            }

            return translation.apply(void 0, params);
          }

          return translation;
        });

        return _this;
      }

      _createClass(Translatable, [{
        key: "render",
        value: function render() {
          return React.createElement(Composed, _extends({
            translate: this.translate
          }, this.props));
        }
      }]);

      return Translatable;
    }(Component);

    var name = Composed.displayName || Composed.name || 'UnknownComponent';
    Translatable.displayName = "Translatable(".concat(name, ")");
    Translatable.propTypes = {
      translations: withKeysPropType(Object.keys(defaultTranslations))
    };
    return Translatable;
  };
}