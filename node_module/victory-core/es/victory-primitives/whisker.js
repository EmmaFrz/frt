import _assign from "lodash/assign";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import CommonProps from "./common-props";
import Helpers from "../victory-util/helpers";
import Line from "./line";

var Whisker = function (_React$Component) {
  _inherits(Whisker, _React$Component);

  function Whisker() {
    _classCallCheck(this, Whisker);

    return _possibleConstructorReturn(this, (Whisker.__proto__ || Object.getPrototypeOf(Whisker)).apply(this, arguments));
  }

  _createClass(Whisker, [{
    key: "render",
    value: function render() {
      var _props = this.props,
          groupComponent = _props.groupComponent,
          lineComponent = _props.lineComponent,
          events = _props.events,
          className = _props.className,
          majorWhisker = _props.majorWhisker,
          minorWhisker = _props.minorWhisker,
          datum = _props.datum,
          active = _props.active,
          transform = _props.transform;

      var style = Helpers.evaluateStyle(this.props.style, datum, active);
      var baseProps = { style: style, events: events, className: className, transform: transform };
      return React.cloneElement(groupComponent, {}, [React.cloneElement(lineComponent, _assign({ key: "major-whisker" }, baseProps, majorWhisker)), React.cloneElement(lineComponent, _assign({ key: "minor-whisker" }, baseProps, minorWhisker))]);
    }
  }]);

  return Whisker;
}(React.Component);

Whisker.propTypes = _extends({}, CommonProps, {
  groupComponent: PropTypes.element,
  lineComponent: PropTypes.element,
  majorWhisker: PropTypes.shape({
    x1: PropTypes.number,
    x2: PropTypes.number,
    y1: PropTypes.number,
    y2: PropTypes.number
  }),
  minorWhisker: PropTypes.shape({
    x1: PropTypes.number,
    x2: PropTypes.number,
    y1: PropTypes.number,
    y2: PropTypes.number
  })
});
Whisker.defaultProps = {
  groupComponent: React.createElement("g", null),
  lineComponent: React.createElement(Line, null)
};
export default Whisker;