var __extends = (this && this.__extends) || (function () {
      var extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    })();
import { GESTURE_PRIORITY_MENU_SWIPE, GESTURE_MENU_SWIPE } from '../../gestures/gesture-controller';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
/**
 * Gesture attached to the content which the menu is assigned to
 */
var MenuContentGesture = (function (_super) {
  __extends(MenuContentGesture, _super);
  /**
   * @param {?} plt
   * @param {?} menu
   * @param {?} gestureCtrl
   * @param {?} domCtrl
   */
  function MenuContentGesture(plt, menu, gestureCtrl, domCtrl) {
    var _this = _super.call(this, plt, plt.doc().body, {
          direction: menu.direction === 'vertical' ? 'y' : 'x',
          edge: menu.side,
          threshold: 5,
          maxEdgeStart: menu.maxEdgeStart || 50,
          zone: false,
          passive: true,
          domController: domCtrl,
          gesture: gestureCtrl.createGesture({
            name: GESTURE_MENU_SWIPE,
            priority: GESTURE_PRIORITY_MENU_SWIPE,
            disableScroll: true
          })
        }) || this;
    _this.menu = menu;
    return _this;
  }
  /**
   * @param {?} ev
   * @return {?}
   */
  MenuContentGesture.prototype.canStart = function (ev) {
    var /** @type {?} */ menu = this.menu;
    if (!menu.canSwipe()) {
      return false;
    }
    if (menu.isOpen) {
      return true;
    }
    else if (menu.getMenuController().getOpen()) {
      return false;
    }
    return _super.prototype.canStart.call(this, ev);
  };
  /**
   * @param {?} ev
   * @return {?}
   */
  MenuContentGesture.prototype.onSlideBeforeStart = function (ev) {
    (void 0) /* console.debug */;
    this.menu._swipeBeforeStart();
  };
  /**
   * @return {?}
   */
  MenuContentGesture.prototype.onSlideStart = function () {
    (void 0) /* console.debug */;
    this.menu._swipeStart();
  };
  /**
   * @param {?} slide
   * @param {?} ev
   * @return {?}
   */
  MenuContentGesture.prototype.onSlide = function (slide, ev) {
    var /** @type {?} */ z = (this.menu.side === 'right' || this.menu.side === 'bottom' ? slide.min : slide.max);
    var /** @type {?} */ stepValue = (slide.distance / z);
    this.menu._swipeProgress(stepValue);
  };
  /**
   * @param {?} slide
   * @param {?} ev
   * @return {?}
   */
  MenuContentGesture.prototype.onSlideEnd = function (slide, ev) {
    var z = (this.menu.side === 'right' || this.menu.side === 'bottom' ? slide.min : slide.max);
    var currentStepValue = (slide.distance / z);
    var velocity = slide.velocity;
    z = Math.abs(z * 0.5);
    var shouldCompleteBottom;
    var shouldCompleteRight = shouldCompleteBottom = (velocity >= 0)
        && (velocity > 0.2 || slide.delta > z);
    var shouldCompleteTop;
    var shouldCompleteLeft = shouldCompleteTop = (velocity <= 0)
        && (velocity < -0.2 || slide.delta < -z);
    (void 0) /* console.debug */;
    this.menu._swipeEnd(shouldCompleteLeft, shouldCompleteRight, shouldCompleteTop, shouldCompleteBottom,
        currentStepValue, velocity);
  };
  /**
   * @param {?} slide
   * @param {?} ev
   * @return {?}
   */
  MenuContentGesture.prototype.getElementStartPos = function (slide, ev) {
    if (this.menu.side === 'right' || this.menu.side === 'bottom') {
      return this.menu.isOpen ? slide.min : slide.max;
    }
    // left && top menu
    return this.menu.isOpen ? slide.max : slide.min;
  };
  /**
   * @return {?}
   */
  MenuContentGesture.prototype.getSlideBoundaries = function () {
    if (this.menu.direction === 'vertical') {
      if (this.menu.side === 'bottom') {
        return {
          min: -this.menu.height(),
          max: 0
        };
      }
      // top menu
      return {
        min: 0,
        max: this.menu.height()
      };
    } else {
      if (this.menu.side === 'right') {
        return {
          min: -this.menu.width(),
          max: 0
        };
      }
      // left menu
      return {
        min: 0,
        max: this.menu.width()
      };
    }
  };
  return MenuContentGesture;
}(SlideEdgeGesture));
export { MenuContentGesture };
function MenuContentGesture_tsickle_Closure_declarations() {
  /** @type {?} */
  MenuContentGesture.prototype.menu;
}
//# sourceMappingURL=menu-gestures.js.map