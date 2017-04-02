import { Component } from '@angular/core';
import { TransactionsService } from "../../services";
import { appConfig } from "../../app/config";
import { Transaction } from "../transactions-history/transaction.class";
import { OrderItem} from "../../components/check-out-list/orderItem.class";

@Component({
  selector: 'page-products-history',
  templateUrl: 'products-history.html'
})
export class ProductsHistoryPage {

  dates: Array<Date> = [];
  transactions: Array<Transaction>;
  filteredTransactions: Array<Transaction>;
  filteredProducts: Array<OrderItem>;
  activeDate: Date;
  currency: string = appConfig.defaultCurrency;

  constructor(private transactionService: TransactionsService) {
    this.transactions = this.transactionService.getTransactions().map(trans => {
      const transDate = new Date(trans.timestamp);
      const dateInHistory = this.dates.some(date => {
        return this.compareDates(date, transDate);
      });
      if (!dateInHistory && trans.orders) this.dates.push(transDate);
      return new Transaction(trans.timestamp, trans.paymentType, trans.total, trans.paidTotal, trans.orders);
    });
    this.filterByDate(new Date());
    this.dates.reverse();
  }

  filterByDate(date: Date) {
    this.activeDate = date;
    this.filteredTransactions = this.transactions.filter(trans => {
      return this.compareDates(new Date(trans.timestamp), date);
    });
    this.filteredProducts = this.filteredTransactions.map(trans => {
      return trans.orders || [];
    }).reduce((prevVal, order) => {
      if (prevVal){
        return prevVal.concat(order);
      }
      return order;
    }, []);
    console.log(this.filteredProducts);
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
