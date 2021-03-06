var __extends = (this && this.__extends) || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
import { Animation } from '../../animations/animation';
import { MenuController } from './menu-controller';
/**
 * @private
 * Menu Type
 * Base class which is extended by the various types. Each
 * type will provide their own animations for open and close
 * and registers itself with Menu.
 */
export var MenuType = (function () {
  function MenuType(plt) {
    this.ani = new Animation(plt);
    this.ani
        .easing('cubic-bezier(0.0, 0.0, 0.2, 1)')
        .easingReverse('cubic-bezier(0.4, 0.0, 0.6, 1)')
        .duration(280);
  }
  MenuType.prototype.setOpen = function (shouldOpen, animated, done) {
    var ani = this.ani
        .onFinish(done, true)
        .reverse(!shouldOpen);
    if (animated) {
      ani.play();
    }
    else {
      ani.play({ duration: 0 });
    }
  };
  MenuType.prototype.setProgressStart = function (isOpen) {
    this.isOpening = !isOpen;
    // the cloned animation should not use an easing curve during seek
    this.ani
        .reverse(isOpen)
        .progressStart();
  };
  MenuType.prototype.setProgessStep = function (stepValue) {
    // adjust progress value depending if it opening or closing
    this.ani.progressStep(stepValue);
  };
  MenuType.prototype.setProgressEnd = function (shouldComplete, currentStepValue, velocity, done) {
    var _this = this;
    var isOpen = (this.isOpening && shouldComplete);
    if (!this.isOpening && !shouldComplete) {
      isOpen = true;
    }
    this.ani.onFinish(function () {
      _this.isOpening = false;
      done(isOpen);
    }, true);
    var factor = 1 - Math.min(Math.abs(velocity) / 4, 0.7);
    var dur = this.ani.getDuration() * factor;
    this.ani.progressEnd(shouldComplete, currentStepValue, dur);
  };
  MenuType.prototype.destroy = function () {
    this.ani && this.ani.destroy();
  };
  return MenuType;
}());
/**
 * @private
 * Menu Reveal Type
 * The content slides over to reveal the menu underneath.
 * The menu itself, which is under the content, does not move.
 */
var MenuRevealType = (function (_super) {
  __extends(MenuRevealType, _super);
  function MenuRevealType(menu, plt) {
    _super.call(this, plt);
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
    this.ani.add(contentOpen);
  }
  return MenuRevealType;
}(MenuType));
MenuController.registerType('reveal', MenuRevealType);
/**
 * @private
 * Menu Push Type
 * The content slides over to reveal the menu underneath.
 * The menu itself also slides over to reveal its bad self.
 */
var MenuPushType = (function (_super) {
  __extends(MenuPushType, _super);
  function MenuPushType(menu, plt) {
    _super.call(this, plt);
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
  }
  return MenuPushType;
}(MenuType));
MenuController.registerType('push', MenuPushType);
/**
 * @private
 * Menu Overlay Type
 * The menu slides over the content. The content
 * itself, which is under the menu, does not move.
 */
var MenuOverlayType = (function (_super) {
  __extends(MenuOverlayType, _super);
  function MenuOverlayType(menu, plt) {
    _super.call(this, plt);
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
  }
  return MenuOverlayType;
}(MenuType));
MenuController.registerType('overlay', MenuOverlayType);
//# sourceMappingURL=menu-types.js.map