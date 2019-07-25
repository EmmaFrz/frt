"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = translatable;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _has2 = _interopRequireDefault(require("lodash/has"));

var _react = _interopRequireWildcard(require("react"));

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

function translatable(defaultTranslations) {
  return function (Composed) {
    var Translatable =
    /*#__PURE__*/
    function (_Component) {
      (0, _inherits2.default)(Translatable, _Component);

      function Translatable() {
        var _getPrototypeOf2;

        var _this;

        (0, _classCallCheck2.default)(this, Translatable);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(Translatable)).call.apply(_getPrototypeOf2, [this].concat(args)));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "translate", function (key) {
          var translations = _this.props.translations;
          var translation = translations && (0, _has2.default)(translations, key) ? translations[key] : defaultTranslations[key];

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

      (0, _createClass2.default)(Translatable, [{
        key: "render",
        value: function render() {
          return _react.default.createElement(Composed, (0, _extends2.default)({
            translate: this.translate
          }, this.props));
        }
      }]);
      return Translatable;
    }(_react.Component);

    var name = Composed.displayName || Composed.name || 'UnknownComponent';
    Translatable.displayName = "Translatable(".concat(name, ")");
    Translatable.propTypes = {
      translations: withKeysPropType(Object.keys(defaultTranslations))
    };
    return Translatable;
  };
}