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
    this.mapTransactions().filterByDate(new Date());
    this.dates.reverse(); // show history from latest to oldest
  }

  /**
   * form array with transactions based on stored in service
   * @return {ProductsHistoryPage}
   */
  mapTransactions() {
    this.transactions = this.transactionService.getTransactions().map(trans => {
      const transDate = new Date(trans.timestamp);
      const dateInHistory = this.dates.some(date => {
        return this.compareDates(date, transDate);
      });

      // avoid dates duplicates if transactions made in the same day
      if (!dateInHistory && trans.orders) this.dates.push(transDate);
      return new Transaction(trans.timestamp, trans.paymentType, trans.total, trans.paidTotal, trans.orders, trans.synced);
    });
    return this;
  }

  /**
   * filter stored transactions by date
   * @param date {Date}
   */
  filterByDate(date: Date) {
    this.activeDate = date;

    this.filteredTransactions = this.transactions.filter(trans => {
      return this.compareDates(new Date(trans.timestamp), date);
    });

    this.makeProducts().sumEqualProducts();
  }

  /**
   * form array with products from stored transactions
   * @return {ProductsHistoryPage}
   */
  makeProducts() {
    this.filteredProducts = this.filteredTransactions.map(trans => {
      return trans.orders || [];
    })
      .reduce((prevVal, order) => {
        if (prevVal){
          return prevVal.concat(order);
        }
        return order;
      }, []);

    return this;
  }

  /**
   * Sum products amount from different transactions and show as total per day
   */
  sumEqualProducts() {
    const uniqueProducts = [];
    this.filteredProducts.forEach(product => {
      // unique product is detected by name
      const matched = uniqueProducts.findIndex(el => el.name === product.name);
      if (matched >= 0) {
          uniqueProducts[matched].total += product.amount * parseFloat(product.price);
          uniqueProducts[matched].amount += product.amount;
      } else {
        // if few manula transactions are with diff price their amount and total sum should be summed
        const productReport = {
          name: product.name,
          amount: product.amount,
          total: product.amount * parseFloat(product.price)
        };
        uniqueProducts.push(productReport);
      }
    });

    // output is an array with unique product reports without duplicated
    this.filteredProducts = uniqueProducts;
  }

  /**
   * Check equality for 2 dates
   * @param dateTo
   * @param dateWith
   * @return {boolean}
   */
  compareDates(dateTo: Date, dateWith: Date) {
    return dateTo.getDay() === dateWith.getDay() && dateTo.getMonth() === dateWith.getMonth()
      && dateTo.getFullYear() === dateTo.getFullYear();
  }

  isDateToday(date: Date) {
    return this.compareDates(new Date(), date);
  }

  /**
   * Sum total price for all products in history per day
   * @return {number}
   */
  getTotal() {
    return this.filteredTransactions.reduce((previousValue, trans) => {
      return previousValue + trans.total;
    }, 0)
  }
}
