import { Injectable, Inject, forwardRef, EventEmitter } from '@angular/core';
import { Transaction } from "../pages/transactions-history/transaction.class";
import { AuthService } from "./auth.service";
import { NetworkService, PaymentService } from "../services";
import { PaymentData } from "../pages/record-payment/paymentData.class";

@Injectable()
export class TransactionsService {

    private storagePath: string;
    private connectSub;

    transactionsChanged: EventEmitter<Transaction[]> = new EventEmitter();

    constructor(private auth: AuthService,
                @Inject(forwardRef(() => NetworkService)) private networkService,
                @Inject(forwardRef(() => PaymentService)) private paymentService) {

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
        return transactions ? JSON.parse(transactions) : [];
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
                ).subscribe(this.syncSuccess.bind(this, trans, allTransactions))
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
     * @param trans
     * @param allTrans
     */
    private syncSuccess(trans: Transaction, allTrans: Array<Transaction>) {
        const ind = allTrans.findIndex(tran => tran.timestamp === trans.timestamp);
        if (ind !== -1) {
            allTrans[ind] = new Transaction(Date.now(), trans.paymentType, trans.total, trans.paidTotal, trans.orders, true);
        }
        this.saveAllTransactions(allTrans);
        this.transactionsChanged.emit(allTrans);
    }

}
