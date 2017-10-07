import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Transaction } from "../transactions-history/transaction.class";
import { appConfig } from "../../app/config";
import { TransactionsService } from "../../services";

@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction-detail.html'
})
export class TransactionDetailPage {


  transaction: Transaction;
  currency: string = appConfig.defaultCurrency;

  constructor(private navParams: NavParams, private transactionsService: TransactionsService) {
    this.transaction = navParams.get('transaction');
  }

  refund() {
    this.transactionsService.makeRefund(this.transaction);
  }

}
