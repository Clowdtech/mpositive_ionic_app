import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CheckOutPage } from "../check-out/check-out";
import { OrderItem } from "../../components/check-out-list/orderItem.class";
import { StarPrinterService } from "../../services";
import { Utils } from "../../services/utils";
import { Bluetooth } from "../../services/bluetooth.service";
import {PaymentType} from "../record-payment/payment";

@Component({
  selector: 'page-result-page',
  templateUrl: 'result-page.html'
})
export class ResultPage {

  change: number;
  orders: Array<OrderItem>;
  payment: PaymentType;
  BTListener: any; // replace with Observable

  constructor(private navCtrl: NavController, private navParams: NavParams, private printer: StarPrinterService,
              private utils: Utils, private bluetooth: Bluetooth) {
    this.change = navParams.get('change') || 0;
    this.orders = navParams.get('orders') || 0;
    this.payment = navParams.get('payment') || 0;

    if (this.payment.name === 'Cash') {
        this.printer.openCashDrawer().then(() => this.utils.showToast('Cash drawer is opened'));
    }

    this.BTListener = this.bluetooth.stateChanged.subscribe(() => {
        if (this.bluetooth.isEnabled) {
            this.utils.showToast(`Bluetooth is enabled`);
        }
    });
  }

  back() {
    this.navCtrl.setRoot(CheckOutPage);
  }

  printReceipt() {
    this.printer.printReceipt(this.orders)
      .then(success => {
        console.log(success);
        this.utils.showToast('Receipt was printed successfully');

        // return to checkout page after success printing
        this.back();
      }, error => {
        console.log(error);
        this.utils.showToast(error);
      });
  }

}
