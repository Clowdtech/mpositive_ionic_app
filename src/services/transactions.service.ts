import { Injectable } from '@angular/core';
import { Transaction } from "../pages/transactions-history/transaction.class";

@Injectable()
export class TransactionsService {

    constructor() {}

    saveTransaction(transaction: Transaction) {
        let transactions = this.getTransactions();
        transactions.push(transaction);
        window.localStorage.setItem('mp_transactions', JSON.stringify(transactions));
    }

    getTransactions() {
        const transactions: any = window.localStorage.getItem('mp_transactions');
        return transactions ? JSON.parse(transactions) : [];
    }

}
