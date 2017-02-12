import { Injectable } from '@angular/core';
import { Transaction } from "../pages/transactions-history/transaction.class";
import {AuthProvider} from "../providers/auth.provider";

@Injectable()
export class TransactionsService {

    private storagePath: string;

    constructor(auth: AuthProvider) {
        this.storagePath = `mp_transactions_${auth.getUID()}`;
    }

    saveTransaction(transaction: Transaction) {
        let transactions = this.getTransactions();
        transactions.push(transaction);
        window.localStorage.setItem(this.storagePath, JSON.stringify(transactions));
    }

    getTransactions() {
        const transactions: any = window.localStorage.getItem(this.storagePath);
        return transactions ? JSON.parse(transactions) : [];
    }

}
