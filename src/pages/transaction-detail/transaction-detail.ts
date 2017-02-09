import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Transaction } from "../transactions-history/transaction.class";
import { appConfig } from "../../app/config";

@Component({
  selector: 'page-transaction-detail',
  templateUrl: 'transaction-detail.html'
})
export class TransactionDetailPage {

  transaction: Transaction;
  currency: string = appConfig.defaultCurrency;

  constructor(private navParams: NavParams) {
    this.transaction = navParams.get('transaction');
    console.log(this.transaction);
  }

}
