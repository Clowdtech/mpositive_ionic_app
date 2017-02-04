import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { appConfig } from "../../app/config";
import { CheckOutListComponent } from "../../components/check-out-list";
import { Product } from "../../components/product";
import { OrderItem } from "../../components/check-out-list";
import { RecordPaymentPage } from "../";
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'page-check-out',
  templateUrl: 'check-out.html'
})
export class CheckOutPage {

  @ViewChild(CheckOutListComponent)
  private checkOutListComponent: CheckOutListComponent;

  private segment: string;
  private customPrice: string;
  private customProductName: string;
  private currency: string = appConfig.defaultCurrency;

  private checkoutPrice: number = 0;

  private orders: Array<OrderItem>;

  constructor(private navCtrl: NavController, private toastCtrl: ToastController) {
    this.segment = 'category';
  }

  keypadUpdated(keypadValue: { integer: number, float: number }) {
    this.customPrice = `${keypadValue.integer}.${keypadValue.float}`
  }
  addCustomProduct() {
    if (!this.customPrice && !this.customProductName) return;
    this.checkOutListComponent.productSelected(
        new Product(UUID.UUID(), this.customProductName, null, this.customPrice, null, null, null, null)
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
      this.checkoutPrice += parseFloat(orderItem.price) * orderItem.amount
    });
  }

  charge() {
    if (!this.orders) {
      let toast = this.toastCtrl.create({
        message: 'Please add items to order',
        duration: 3000
      });
      toast.present();
      return;
    }
    this.navCtrl.push(RecordPaymentPage, {
      orders: this.orders,
      checkoutPrice: this.checkoutPrice
    })
  }

}
