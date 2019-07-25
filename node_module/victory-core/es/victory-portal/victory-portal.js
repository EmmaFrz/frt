import _defaults from "lodash/defaults";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";

import Log from "../victory-util/log";
import Helpers from "../victory-util/helpers";

var VictoryPortal = function (_React$Component) {
  _inherits(VictoryPortal, _React$Component);

  function VictoryPortal() {
    _classCallCheck(this, VictoryPortal);

    return _possibleConstructorReturn(this, (VictoryPortal.__proto__ || Object.getPrototypeOf(VictoryPortal)).apply(this, arguments));
  }

  _createClass(VictoryPortal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.checkedContext) {
        if (typeof this.context.portalUpdate !== "function") {
          var msg = "`renderInPortal` is not supported outside of `VictoryContainer`. " + "Component will be rendered in place";
          Log.warn(msg);
          this.renderInPlace = true;
        }
        this.checkedContext = true;
      }
      this.forceUpdate();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (!this.renderInPlace) {
        this.portalKey = this.portalKey || this.context.portalRegister();
        this.context.portalUpdate(this.portalKey, this.element);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.context && this.context.portalDeregister) {
        this.context.portalDeregister(this.portalKey);
      }
    }

    // Overridden in victory-core-native

  }, {
    key: "renderPortal",
    value: function renderPortal(child) {
      if (this.renderInPlace) {
        return child;
      }
      this.element = child;
      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var children = Array.isArray(this.props.children) ? this.props.children[0] : this.props.children;
      var groupComponent = this.props.groupComponent;

      var childProps = children && children.props || {};
      var standardProps = childProps.groupComponent ? { groupComponent: groupComponent, standalone: false } : {};
      var newProps = _defaults(standardProps, childProps, Helpers.omit(this.props, ["children", "groupComponent"]));
      var child = children && React.cloneElement(children, newProps);
      return this.renderPortal(child);
    }
  }]);

  return VictoryPortal;
}(React.Component);

VictoryPortal.displayName = "VictoryPortal";
VictoryPortal.role = "portal";
VictoryPortal.propTypes = {
  children: PropTypes.node,
  groupComponent: PropTypes.element
};
VictoryPortal.defaultProps = {
  groupComponent: React.createElement("g", null)
};
VictoryPortal.contextTypes = {
  portalDeregister: PropTypes.func,
  portalRegister: PropTypes.func,
  portalUpdate: PropTypes.func
};
export default VictoryPortal;