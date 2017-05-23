import { Component, ViewChild } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { appConfig } from "../../app/config";
import { CheckOutListComponent } from "../../components/check-out-list";
import { Product } from "../../components/product";
import { OrderItem } from "../../components/check-out-list";
import { RecordPaymentPage } from "../";
import { UUID } from 'angular2-uuid';
import { Utils } from "../../services";
import {KeypadComponent} from "../../components/keypad/keypad";

@Component({
  selector: 'page-check-out',
  templateUrl: 'check-out.html'
})
export class CheckOutPage {

  @ViewChild(CheckOutListComponent) checkOutListComponent : CheckOutListComponent;
  @ViewChild(KeypadComponent) keypadComponent : KeypadComponent;
  @ViewChild(Slides) slides: Slides;

  currency: string = appConfig.defaultCurrency;

  private segment: string;
  private manualTransaction: string = 'manual transaction';
  private customProductName: string;

  private checkoutPrice: number = 0.00;
  private customPrice: number = 0.00;

  private orders: Array<OrderItem>;

  constructor(private navCtrl: NavController, private utils: Utils) {
    this.segment = 'category';
  }

  /**
   * New product selected, so is needed to update check out list
   * @param product
   */
  productSelected(product: Product) {
    this.checkOutListComponent.productSelected(product);
  }

  /**
   * Received new value from keypad
   * @param keypadValue
   */
  keypadUpdated(keypadValue: number) {
    this.customPrice = keypadValue;
  }

  /**
   * Add product typed with keypad
   */
  addCustomProduct() {
    this.checkOutListComponent.productSelected(
        new Product(null, this.customProductName || this.manualTransaction, null, this.customPrice.toFixed(2), null, null, null, null)
    );
    this.clearCustomProduct();
  }

  /**
   * Clear custom product after added to orders
   */
  clearCustomProduct() {
    this.customProductName = name;
    this.keypadComponent.clear();
  }

  /**
   * handler when order is changed (listed products, amount)
   * @param orders
   */
  ordersChanged(orders: Array<OrderItem>) {
    this.orders = orders;
    this.calcTotalPrice();
  }

  /**
   * Calculate total price for order
   */
  calcTotalPrice() {
    this.checkoutPrice = 0;
    this.orders.forEach((orderItem: OrderItem) => {
      this.checkoutPrice += parseFloat(orderItem.price) * orderItem.amount;
    });
  }

  /**
   * Open record payment page with selecting payment type
   */
  charge() {
    if (!this.checkoutPrice) {
      this.utils.showToast('Please add items to order');
      return;
    }
    this.navCtrl.push(RecordPaymentPage, {
      orders: this.orders,
      checkoutPrice: this.checkoutPrice
    })
  }

  /**
   * Slide to catalog page
   */
  slidePrev() {
    this.slides.slideTo(0);
  }

  /**
   * Slide to keypad page
   */
  slideNext() {
    this.slides.slideTo(1);
  }

  /**
   * Detect when slides changed to highlight correct button
   */
  slideChanged() {
    const ind = this.slides.getActiveIndex();
    switch (ind) {
      case 0:
        this.segment = 'category';
        break;
      case 1:
        this.segment = 'keypad';
        break;
    }
  }

}
