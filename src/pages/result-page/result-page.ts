import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NavController, NavParams } from 'ionic-angular';
import { CheckOutPage } from "../check-out/check-out";
import { appConfig } from "../../app/config";
import { OrderItem } from "../../components/check-out-list/orderItem.class";
import { StarPrinterService } from "../../services";
import {Utils} from "../../services/utils";
import {Bluetooth} from "../../services/bluetooth.service";

@Component({
  selector: 'page-result-page',
  templateUrl: 'result-page.html'
})
export class ResultPage {

  change: number;
  currency: string = appConfig.defaultCurrency;
  orders: Array<OrderItem>;
  BTListener: any; // replace with Observable

  constructor(private navCtrl: NavController, private navParams: NavParams, private printer: StarPrinterService,
              private utils: Utils, private bluetooth: Bluetooth) {
    this.change = navParams.get('change') || 0;
    this.orders = navParams.get('orders') || 0;

    this.BTListener = this.bluetooth.stateChanged.subscribe(() => {
        if (this.bluetooth.isEnabled) {
            this.utils.showToast(`Bluetooth is ${this.bluetooth.isEnabled}`);
        }
    });
  }

  back() {
    this.navCtrl.setRoot(CheckOutPage);
  }

  /**
   * Create receipt body
   * @return {string}
  **/
  formReceiptBody() {
      let receiptStr = '',
          total = 0;

      this.orders.map(order => {
          const subTotal = order.amount * parseFloat(order.price),
            orderName = `${order.amount} ${order.name}`.toUpperCase(),
            subTotalStr = `${this.currency}${subTotal}`,
            orderChunks = this.printer.chunkString(orderName, this.printer.receiptWidth - 10 - 4); // 8 - $000000.00

          orderChunks.forEach((chunk, pos) => {
              if (pos === 0) {
                  const firstLine = `\n${chunk}${this.printer.alignRight(subTotalStr, chunk.length)}`;
                  receiptStr += firstLine;
                  return;
              }
              receiptStr += `\n  ${chunk}`;
          });

          total += subTotal;
      });

      // line divider after all orders
      receiptStr += `\n${this.printer.alignRight('--------')}`;

      // total value for orders
      const totalTxt = ` Total Due`,
        totalValueStr = `${this.currency}${total.toFixed(2)}`;
      receiptStr += `\n${totalTxt}${this.printer.alignRight(totalValueStr, totalTxt.length)}`;

      const date = new DatePipe('en-UK').transform(new Date(Date.now()), 'dd/MM/yyyy H:mm:ss');
      receiptStr += `\n\n  ${date}`;

      console.log(receiptStr);

      return receiptStr;
  }

  printReceipt() {
    const receiptBody = this.formReceiptBody();

    this.printer.print(`
        \n\n${this.printer.alignCenter(this.printer.receipt.header)}
        \n\n${receiptBody}
        \n\n${this.printer.receipt.footer}
        \n\n\n`)
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
