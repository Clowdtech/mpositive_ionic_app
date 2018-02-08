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
import { Animation } from '../../animations/animation';
import { MenuController } from '../app/menu-controller';
/**
 * @hidden
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
var MenuType = (function () {
  /**
   * @param {?} plt
   */
  function MenuType(plt) {
    this.ani = new Animation(plt);
    this.ani
        .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
        .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
        .duration(280);
  }
  /**
   * @param {?} shouldOpen
   * @param {?} animated
   * @param {?} done
   * @return {?}
   */
  MenuType.prototype.setOpen = function (shouldOpen, animated, done) {
    var /** @type {?} */ ani = this.ani
        .onFinish(done, true, true)
        .reverse(!shouldOpen);
    if (animated) {
      ani.play();
    }
    else {
      ani.syncPlay();
    }
  };
  /**
   * @param {?} isOpen
   * @return {?}
   */
  MenuType.prototype.setProgressStart = function (isOpen) {
    this.isOpening = !isOpen;
    // the cloned animation should not use an easing curve during seek
    this.ani
        .reverse(isOpen)
        .progressStart();
  };
  /**
   * @param {?} stepValue
   * @return {?}
   */
  MenuType.prototype.setProgessStep = function (stepValue) {
    // adjust progress value depending if it opening or closing
    this.ani.progressStep(stepValue);
  };
  /**
   * @param {?} shouldComplete
   * @param {?} currentStepValue
   * @param {?} velocity
   * @param {?} done
   * @return {?}
   */
  MenuType.prototype.setProgressEnd = function (shouldComplete, currentStepValue, velocity, done) {
    var _this = this;
    var /** @type {?} */ isOpen = (this.isOpening && shouldComplete);
    if (!this.isOpening && !shouldComplete) {
      isOpen = true;
    }
    var /** @type {?} */ ani = this.ani;
    ani.onFinish(function () {
      _this.isOpening = false;
      done(isOpen);
    }, true);
    var /** @type {?} */ factor = 1 - Math.min(Math.abs(velocity) / 4, 0.7);
    var /** @type {?} */ dur = ani.getDuration() * factor;
    ani.progressEnd(shouldComplete, currentStepValue, dur);
  };
  /**
   * @return {?}
   */
  MenuType.prototype.destroy = function () {
    this.ani && this.ani.destroy();
    this.ani = null;
  };
  return MenuType;
}());
export { MenuType };
function MenuType_tsickle_Closure_declarations() {
  /** @type {?} */
  MenuType.prototype.ani;
  /** @type {?} */
  MenuType.prototype.isOpening;
}
/**
 * @hidden
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
var MenuRevealType = (function (_super) {
  __extends(MenuRevealType, _super);
  /**
   * @param {?} menu
   * @param {?} plt
   */
  function MenuRevealType(menu, plt) {
    var _this = _super.call(this, plt) || this;
    var opened;
    var contentOpen = new Animation(plt, menu.getContentElement());
    if (menu.horizontal === 'vertical') {
      opened = (menu.height() * (menu.side === 'top' ? 1 : -1)) + 'px';
      direction = 'translateY';
    } else {
      opened = (menu.width() * (menu.side === 'right' ? -1 : 1)) + 'px';
      direction = 'translateX';
    }
    contentOpen.fromTo(direction, '0px', opened);
    _this.ani.add(contentOpen);
    return _this;
  }
  return MenuRevealType;
}(MenuType));
MenuController.registerType('reveal', MenuRevealType);
/**
 * @hidden
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
var MenuPushType = (function (_super) {
  __extends(MenuPushType, _super);
  /**
   * @param {?} menu
   * @param {?} plt
   */
  function MenuPushType(menu, plt) {
    let _this = _super.call(this, plt);
    var contentOpened, menuClosed, menuOpened, direction;
    if (menu.direction === 'vertical') {
      var contentOpenedY, menuClosedY, menuOpenedY;
      if (menu.side === 'top') {
        contentOpenedY = menu.height() + 'px';
        menuOpenedY = '0px';
        menuClosedY = -menu.height() + 'px';
      } else {
        contentOpenedY = -menu.height() + 'px';
        menuOpenedY = '0px';
        menuClosedY = menu.height() + 'px';
      }
      contentOpened = contentOpenedY;
      menuClosed = menuClosedY;
      menuOpened = menuOpenedY;
      direction = 'translateY';
    } else {
      var contentOpenedX, menuClosedX, menuOpenedX;
      if (menu.side === 'right') {
        contentOpenedX = -menu.width() + 'px';
        menuClosedX = menu.width() + 'px';
        menuOpenedX = '0px';
      }
      else {
        contentOpenedX = menu.width() + 'px';
        menuOpenedX = '0px';
        menuClosedX = -menu.width() + 'px';
      }
      contentOpened = contentOpenedX;
      menuClosed = menuClosedX;
      menuOpened = menuOpenedX;
      direction = 'translateX';
    }
    var menuAni = new Animation(plt, menu.getMenuElement());
    menuAni.fromTo(direction, menuClosed, menuOpened);
    this.ani.add(menuAni);
    var contentApi = new Animation(plt, menu.getContentElement());
    contentApi.fromTo(direction, '0px', contentOpened);
    this.ani.add(contentApi);
    return _this;
  }
  return MenuPushType;
}(MenuType));
MenuController.registerType('push', MenuPushType);
/**
 * @hidden
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
var MenuOverlayType = (function (_super) {
  __extends(MenuOverlayType, _super);
  /**
   * @param {?} menu
   * @param {?} plt
   */
  function MenuOverlayType(menu, plt) {
    let _this = _super.call(this, plt);
    var closed, opened, direction;
    if (menu.direction === 'vertical') {
      var closedY, openedY;
      if (menu.side === 'top') {
        closedY = -(8 + menu.height()) + 'px';
        openedY = '0px';
      } else {
        closedY = 8 + menu.height() + 'px';
        openedY = '0px';
      }
      closed = closedY;
      opened = openedY;
      direction = 'translateY';
    } else {
      var closedX, openedX;
      if (menu.side === 'right') {
        closedX = 8 + menu.width() + 'px';
        openedX = '0px';
      }
      else {
        closedX = -(8 + menu.width()) + 'px';
        openedX = '0px';
      }
      closed = closedX;
      opened = openedX;
      direction = 'translateX';
    }
    var menuAni = new Animation(plt, menu.getMenuElement());
    menuAni.fromTo(direction, closed, opened);
    this.ani.add(menuAni);
    var backdropApi = new Animation(plt, menu.getBackdropElement());
    backdropApi.fromTo('opacity', 0.01, 0.35);
    this.ani.add(backdropApi);
    return _this;
  }
  return MenuOverlayType;
}(MenuType));
MenuController.registerType('overlay', MenuOverlayType);
//# sourceMappingURL=menu-types.js.map