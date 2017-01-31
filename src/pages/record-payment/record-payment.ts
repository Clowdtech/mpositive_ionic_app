import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { OrderItem } from "../../components/check-out-list/orderItem.class";

@Component({
  selector: 'page-record-payment',
  templateUrl: 'record-payment.html'
})
export class RecordPaymentPage {

  private orders: Array<OrderItem>;
  private checkoutPrice: number;
  private payments: any; // TODO get from server and form segment buttons dynamically
  private activePayment;

  constructor(private navParams: NavParams) {
    this.orders = this.navParams.get('orders');
    this.checkoutPrice = this.navParams.get('checkoutPrice');
  }

}
