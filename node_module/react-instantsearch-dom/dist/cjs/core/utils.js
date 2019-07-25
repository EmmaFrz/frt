"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.capitalize = exports.isSpecialClick = exports.createClassNames = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var createClassNames = function createClassNames(block) {
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'ais';
  return function () {
    for (var _len = arguments.length, elements = new Array(_len), _key = 0; _key < _len; _key++) {
      elements[_key] = arguments[_key];
    }

    var suitElements = elements.filter(function (element) {
      return element || element === '';
    }).map(function (element) {
      var baseClassName = "".concat(prefix, "-").concat(block);
      return element ? "".concat(baseClassName, "-").concat(element) : baseClassName;
    });
    return (0, _classnames.default)(suitElements);
  };
};

exports.createClassNames = createClassNames;

var isSpecialClick = function isSpecialClick(event) {
  var isMiddleClick = event.button === 1;
  return Boolean(isMiddleClick || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
};

exports.isSpecialClick = isSpecialClick;

var capitalize = function capitalize(key) {
  return key.length === 0 ? '' : "".concat(key[0].toUpperCase()).concat(key.slice(1));
};

exports.capitalize = capitalize;