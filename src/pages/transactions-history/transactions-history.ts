import { Component } from '@angular/core';
import { Transaction } from "./transaction.class";
import { TransactionsService } from "../../services";
import { appConfig } from "../../app/config";

@Component({
  selector: 'page-transactions-history',
  templateUrl: 'transactions-history.html'
})
export class TransactionsHistoryPage {

  dates: Array<Date> = [];
  transactions: Array<Transaction>;
  filteredTransactions: Array<Transaction>;
  activeDate: Date;
  private currency: string = appConfig.defaultCurrency;

  constructor(private transactionService: TransactionsService) {
    this.transactions = this.transactionService.getTransactions().map(trans => {
      const transDate = new Date(trans.timestamp);
      const dateInHistory = this.dates.some(date => {
        return this.compareDates(date, transDate);
      });
      if (!dateInHistory) this.dates.push(transDate);
      return new Transaction(trans.timestamp, trans.paymentType, trans.total);
    });
    this.filterByDate(new Date());
    this.dates.reverse();
  }

  filterByDate(date: Date) {
    this.activeDate = date;
    return this.filteredTransactions = this.transactions.filter(trans => {
      return this.compareDates(new Date(trans.timestamp), date);
    }).reverse();
  }

  compareDates(dateTo: Date, dateWith: Date) {
    return dateTo.getDay() === dateWith.getDay() && dateTo.getMonth() === dateWith.getMonth();
  }

  isDateToday(date: Date) {
    return this.compareDates(new Date(), date);
  }

  getTotal() {
    return this.filteredTransactions.reduce((previousValue, trans) => {
      return previousValue + trans.total;
    }, 0)
  }



}
