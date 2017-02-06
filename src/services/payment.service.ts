import { Injectable } from '@angular/core';
import {PaymentType} from "../pages/record-payment/payment";

@Injectable()
export class PaymentService {

    private payments: Array<PaymentType>;

    constructor() {}

    setPayments(paymentsResponseArray) {
        this.payments = paymentsResponseArray.map((payment) => {
            if (payment instanceof PaymentType) return payment;
            return new PaymentType(payment.id, payment.name);
        });
    }

    getPayments() {
        return this.payments;
    }

    saveTransaction(transaction: {timestamp: number, paymentType: string; total: number}) {
        let transactions = this.getTransactions();
        transactions.push(transaction);
        window.localStorage.setItem('mp_transactions', JSON.stringify(transactions));
    }

    getTransactions() {
        const transactions: any = window.localStorage.getItem('mp_transactions');
        return transactions ? JSON.parse(transactions) : [];
    }

}
