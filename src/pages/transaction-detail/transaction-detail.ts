import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Transaction } from "../transactions-history/transaction.class";
import { appConfig } from "../../app/config";
import { TransactionsService } from "../../services";
import {StarPrinterService} from "../../services/starPrinter.service";
import {Utils} from "../../services/utils";

@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction-detail.html'
})
export class TransactionDetailPage {


  transaction: Transaction;
  currency: string = appConfig.defaultCurrency;

  constructor(private navParams: NavParams, private transactionsService: TransactionsService,
              private printer: StarPrinterService, private utils: Utils) {
    this.transaction = navParams.get('transaction');
  }

  refund() {
    this.transactionsService.makeRefund(this.transaction);
  }

  print() {
    this.printer.printReceipt(this.transaction.orders, this.transaction.timestamp).then(response => {
        console.log(response);
        this.utils.showToast('Receipt was printed successfully');
    }, error => {
        console.log(error);
        this.utils.showToast(error);
    });
  }
}
