import { Component } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { OrderItem } from "../../components/check-out-list/orderItem.class";
import { PaymentProvider } from "../../providers";
import { PaymentService, Utils, TransactionsService, CheckoutService } from "../../services";
import { PaymentType } from "./payment";
import { appConfig } from "../../app/config";
import { PaymentData } from "./paymentData.class";
import { Transaction } from "../transactions-history/transaction.class";
import { ResultPage } from "../";

@Component({
    selector: 'page-record-payment',
    templateUrl: 'record-payment.html'
})
export class RecordPaymentPage {

    currency: string = appConfig.defaultCurrency;

    private DEFAULT_PAYMENTS = {
        CARD: 'Card',
        CASH: 'Cash',
        OTHER: 'Other'
    };

    private checkoutPrice: number;
    private paymentTotal: number = 0;

    private activePayment: PaymentType;

    protected orders: Array<OrderItem>;
    private payments: Array<PaymentType>;

    constructor(private navParams: NavParams, private paymentProvider: PaymentProvider, private utils: Utils,
                private paymentService: PaymentService, private transactionService: TransactionsService,
                private nav: NavController, private checkoutService: CheckoutService) {
        this.orders = this.navParams.get('orders').filter((order: OrderItem) => {
            return order.amount > 0;
        });
        this.checkoutPrice = this.navParams.get('checkoutPrice');
    }

    getPayments() {
        const payments = this.paymentService.getPayments() || null;
        if (payments && payments.length > 0) {
            this.activePayment = payments[0];
            this.payments = payments;
            return this.payments;
        }
        return null;
    }

    selectPayment(payment: PaymentType) {
        this.activePayment = payment;
    }

    recordPayment() {
        if (this.activePayment.name !== this.DEFAULT_PAYMENTS.CARD && (this.paymentTotal < this.checkoutPrice || !this.paymentTotal)) {
            this.utils.showToast('Please type correct received total value');
            return;
        }
        this.paymentProvider.registerPayment(new PaymentData(this.orders, this.checkoutPrice, this.activePayment))
            .subscribe(
                data => {
                    if (data.json().success) {
                        this.paymentSuccess();
                    }
                }, error =>  console.log(error.json())
            );
    }

    keypadUpdated(keypadValue: number) {
        this.paymentTotal = keypadValue;
    }

    private paymentSuccess() {
        const change = this.paymentTotal > 0 ? this.paymentTotal - this.checkoutPrice : 0;
        this.checkoutService.clearOrders();
        this.transactionService.saveTransaction(
            new Transaction(Date.now(), this.activePayment.name, this.checkoutPrice, this.paymentTotal, this.orders)
        );
        this.nav.push(ResultPage, { change });
    }

    ionViewCanEnter() {
        // TODO try not use promise but return true/false or use toPromise
        // this.nav.push(PAGE).catch(()=>{});
        return this.paymentProvider.getPayments().then(
            (data) => {
                this.paymentService.setPayments(data);
                this.getPayments();
            }
        );
    }
}
