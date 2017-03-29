import { Component, ViewChild, forwardRef, Inject } from '@angular/core';
import { NavController, Slides } from 'ionic-angular';
import { appConfig } from "../../app/config";
import { CheckOutListComponent } from "../../components/check-out-list";
import { Product } from "../../components/product";
import { OrderItem } from "../../components/check-out-list";
import { RecordPaymentPage } from "../";
import { UUID } from 'angular2-uuid';
import { Utils } from "../../services";

@Component({
  selector: 'page-check-out',
  templateUrl: 'check-out.html'
})
export class CheckOutPage {

  @ViewChild(CheckOutListComponent) checkOutListComponent : CheckOutListComponent;
  @ViewChild(Slides) slides: Slides;

  private segment: string;
  private customProductName: string;
  private currency: string = appConfig.defaultCurrency;

  private checkoutPrice: number = 0.00;
  private customPrice: number = 0.00;

  private orders: Array<OrderItem>;

  constructor(private navCtrl: NavController, private utils: Utils) {
    this.segment = 'category';
  }

  productSelected(product: Product) {
    this.checkOutListComponent.productSelected(product);
  }

  keypadUpdated(keypadValue: number) {
    this.customPrice = keypadValue;
  }
  addCustomProduct() {
    if (!this.customPrice && !this.customProductName) return;
    this.checkOutListComponent.productSelected(
        new Product(UUID.UUID(), this.customProductName, null, this.customPrice.toString(), null, null, null, null)
    );
  }
  setCustomName(name: string) {
    this.customProductName = name;
  }

  ordersChanged(orders: Array<OrderItem>) {
    this.orders = orders;
    this.calcTotalPrice();
  }
  calcTotalPrice() {
    this.checkoutPrice = 0;
    this.orders.forEach((orderItem: OrderItem) => {
      this.checkoutPrice += parseFloat(orderItem.price) * orderItem.amount;
    });
  }

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

  slidePrev() {
    this.slides.slideTo(0);
  }

  slideNext() {
    this.slides.slideTo(1);
  }

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
