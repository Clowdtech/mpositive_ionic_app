import { Injectable, Inject, forwardRef, EventEmitter } from '@angular/core';
import { Transaction } from "../pages/transactions-history/transaction.class";
import { AuthService } from "./auth.service";
import { NetworkService, PaymentService } from "../services";
import { PaymentData } from "../pages/record-payment/paymentData.class";
import {TransactionProvider} from "../providers/transaction.provider";
import {Utils} from "./utils";

@Injectable()
export class TransactionsService {

    private storagePath: string;
    private connectSub;
    private transactions: Array<Transaction>;

    transactionsChanged: EventEmitter<Transaction[]> = new EventEmitter();

    constructor(private auth: AuthService,
                @Inject(forwardRef(() => NetworkService)) private networkService,
                @Inject(forwardRef(() => PaymentService)) private paymentService,
                @Inject(forwardRef(() => TransactionProvider)) private transactionProvider,
                @Inject(forwardRef(() => Utils)) private utils) {

        this.storagePath = `mp_transactions_`;

        this.saveUnSyncTransactions();
        this.subWhenConnected();

    }

    saveTransaction(transaction: Transaction) {
        let transactions = this.getTransactions();
        transactions.push(transaction);
        window.localStorage.setItem(`${this.storagePath}${this.auth.getKey()}`, JSON.stringify(transactions));
    }

    getTransactions() {
        const transactions: any = window.localStorage.getItem(`${this.storagePath}${this.auth.getKey()}`);

        let transactionsArr = transactions ? JSON.parse(transactions) : [];
        transactionsArr.map(trans => {
            return new Transaction(trans.timestamp, trans.paymentType, trans.total, trans.paidTotal, trans.orders,
                trans.synced, trans.refunded);
        });

        this.transactions = transactionsArr;

        return transactionsArr;
    }

    saveAllTransactions(transactions: Array<Transaction>) {
        if (!transactions) return;
        window.localStorage.setItem(`${this.storagePath}${this.auth.getKey()}`, JSON.stringify(transactions));
    }

    subWhenConnected() {
        this.connectSub = this.networkService.connectSubscription.subscribe(() => {
            this.saveUnSyncTransactions();
        });
    }

    makeRefund(transaction: Transaction) {
        this.transactionProvider.makeRefund(transaction).subscribe(data => {
            console.log(data);
            transaction.refunded = true;
            this.updateTransaction(transaction);
            this.utils.showToast('Your Transactions has been refunded');
        });

    }

    /**
     * Record payments those were made offline
     */
    saveUnSyncTransactions() {
        if (!navigator.onLine) return;
        const allTransactions = this.getTransactions();
        allTransactions.forEach(trans => {
            if (!trans.synced) {
                this.paymentService.registerPayment(
                    new PaymentData(
                        trans.orders, trans.total, trans.paymentType
                    )
                ).subscribe(this.syncSuccess.bind(this, trans))
            }
        });
    }

    logIn() {
        this.subWhenConnected();
    }

    logOut() {
        this.connectSub.unsubscribe();
        delete this.connectSub;
    }

    /**
     * Update storage with synced transactions
     * @param transaction
     * @param data
     */
    private syncSuccess(transaction: Transaction, data: any) {
        transaction.uid = data.json().transaction_uid;
        transaction.synced = true;
        this.updateTransaction(transaction);
    }

    private updateTransaction(transaction: Transaction) {
        const ind = this.transactions.findIndex(tran => tran.timestamp === transaction.timestamp);
        if (ind !== -1) {
            this.transactions[ind] = transaction;
        }

        this.saveAllTransactions(this.transactions);
        this.transactionsChanged.emit(this.transactions);
    }

}
