import { Component, OnDestroy } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Transaction } from "./transaction.class";
import { TransactionsService } from "../../services";
import { appConfig } from "../../app/config";
import { TransactionDetailPage } from "../";

@Component({
  selector: 'page-transactions-history',
  templateUrl: 'transactions-history.html'
})
export class TransactionsHistoryPage implements OnDestroy{

  dates: Array<Date> = [];
  transactions: Array<Transaction>;
  filteredTransactions: Array<Transaction>;
  activeDate: Date;
  currency: string = appConfig.defaultCurrency;

  private subTransChanged;

  constructor(private transactionService: TransactionsService, private modalCtrl: ModalController) {
    this.transactions = this.mapTransactions(transactionService.getTransactions());
    this.filterByDate(new Date());
    this.dates.reverse();

    // subscribe to changes on transaction service
    // (important to track when not synced transactions are saved)
    this.subTransChanged = this.transactionService.transactionsChanged.subscribe(transactions => {
      this.transactions = this.mapTransactions(transactions);
      this.filterByDate(this.activeDate);
    });
  }

  /**
   * map transactions array and add all trans dates to history dates list
   * @param transactions
   * @returns {Transaction[]}
   */
  mapTransactions(transactions: Transaction[]) {
    return transactions.map(trans => {
      const transDate = new Date(trans.timestamp);
      const dateInHistory = this.dates.some(date => {
        return this.compareDates(date, transDate);
      });

      if (!dateInHistory) this.dates.push(transDate);
      return new Transaction(trans.timestamp, trans.paymentType, trans.total, trans.paidTotal, trans.orders, trans.synced);
    });
  }

  /**
   * Filter transactions by date and show just for active one
   * @param date
   * @returns {Transaction[]}
   */
  filterByDate(date: Date) {
    this.activeDate = date;
    return this.filteredTransactions = this.transactions.filter(trans => {
      return this.compareDates(new Date(trans.timestamp), date);
    }).reverse();
  }

  /**
   * Compare if two dates are equal
   * @param dateTo
   * @param dateWith
   * @returns {boolean}
   */
  compareDates(dateTo: Date, dateWith: Date) {
    return dateTo.getDay() === dateWith.getDay() && dateTo.getMonth() === dateWith.getMonth()
        && dateTo.getFullYear() === dateWith.getFullYear();
  }

  /**
   * Check if certain date is today date
   * @param date
   * @returns {boolean}
   */
  isDateToday(date: Date) {
    return this.compareDates(new Date(), date);
  }

  /**
   * Summarize total of all transactions
   * @returns {number}
   */
  getTotal() {
    return this.filteredTransactions.reduce((previousValue, trans) => {
      return previousValue + trans.total;
    }, 0)
  }

  /**
   * Open detail page when click on each transaction
   * @param transaction
   */
  openDetailPage(transaction: Transaction) {
    let transDetailModal = this.modalCtrl.create(TransactionDetailPage, { transaction });
    transDetailModal.present();
  }

  ngOnDestroy(): void {
    this.subTransChanged.unsubscribe();
  }

}
