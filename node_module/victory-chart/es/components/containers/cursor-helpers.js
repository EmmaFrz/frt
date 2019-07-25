import _isFunction from "lodash/isFunction";
import _throttle from "lodash/throttle";
import { Selection } from "victory-core";

import BrushHelpers from "./brush-helpers";

var CursorHelpers = {
  onMouseMove: function (evt, targetProps) {
    var onCursorChange = targetProps.onCursorChange,
        cursorDimension = targetProps.cursorDimension,
        domain = targetProps.domain;

    var parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);
    var cursorSVGPosition = Selection.getSVGEventCoordinates(evt, parentSVG);
    var cursorValue = Selection.getDataCoordinates(targetProps, targetProps.scale, cursorSVGPosition.x, cursorSVGPosition.y);

    var inBounds = BrushHelpers.withinBounds(cursorValue, {
      x1: domain.x[0],
      x2: domain.x[1],
      y1: domain.y[0],
      y2: domain.y[1]
    });

    if (!inBounds) {
      cursorValue = null;
    }

    if (_isFunction(onCursorChange)) {
      if (inBounds) {
        var value = cursorDimension ? cursorValue[cursorDimension] : cursorValue;
        onCursorChange(value, targetProps);
      } else if (cursorValue !== targetProps.cursorValue) {
        onCursorChange(targetProps.defaultCursorValue || null, targetProps);
      }
    }

    return [{
      target: "parent",
      eventKey: "parent",
      mutation: function () {
        return { cursorValue: cursorValue, parentSVG: parentSVG };
      }
    }];
  }
};

export default {
  onMouseMove: _throttle(CursorHelpers.onMouseMove.bind(CursorHelpers), 32, // eslint-disable-line no-magic-numbers
  { leading: true, trailing: false })
};