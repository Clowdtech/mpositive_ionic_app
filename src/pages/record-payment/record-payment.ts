import { Component, OnDestroy } from '@angular/core';
import { NavParams, NavController } from 'ionic-angular';
import { OrderItem } from "../../components/check-out-list/orderItem.class";
import { PaymentProvider } from "../../providers";
import { PaymentService, Utils, TransactionsService, CheckoutService, NetworkService, AuthService } from "../../services";
import { PaymentType } from "./payment";
import { appConfig } from "../../app/config";
import { PaymentData } from "./paymentData.class";
import { Transaction } from "../transactions-history/transaction.class";
import { ResultPage } from "../";

@Component({
    selector: 'page-record-payment',
    templateUrl: 'record-payment.html'
})
export class RecordPaymentPage implements OnDestroy {

    currency: string = appConfig.defaultCurrency;
    payments: Array<PaymentType>;

    private DEFAULT_PAYMENTS = {
        CARD: 'Card',
        CASH: 'Cash',
        OTHER: 'Other'
    };

    private checkoutPrice: number;
    private paymentTotal: number = 0;
    private connectSub;
    private activePayment: PaymentType;

    protected orders: Array<OrderItem>;

    constructor(private navParams: NavParams, private paymentProvider: PaymentProvider, private utils: Utils,
                private paymentService: PaymentService, private transactionService: TransactionsService,
                private nav: NavController, private checkoutService: CheckoutService,
                private networkService: NetworkService,
                private auth: AuthService) {

        this.orders = this.navParams.get('orders').filter((order: OrderItem) => {
            return order.amount > 0;
        });
        this.checkoutPrice = this.navParams.get('checkoutPrice');

        this.connectSub = this.networkService.connectSubscription.subscribe(() => {
            this.auth.authPromise.then(() => {
                this.getPayments();
            });
        });
    }

    getPayments() {
        return this.paymentService.getPayments().then((payments: Array<PaymentType>) => {
            this.activePayment = payments[0];
            this.payments = payments;
        }, error => {
            console.log(error);
        });
    }

    selectPayment(payment: PaymentType) {
        this.activePayment = payment;
    }

    recordPayment() {
        if (this.activePayment.name !== this.DEFAULT_PAYMENTS.CARD && (this.paymentTotal < this.checkoutPrice || !this.paymentTotal)) {
            this.utils.showToast('Please type correct received total value');
            return;
        }
        if (!navigator.onLine) {
            // save transaction to storage and mark as not sync
            this.paymentSuccess(false);
            return;
        }
        this.paymentService.registerPayment(new PaymentData(this.orders, this.checkoutPrice, this.activePayment))
            .subscribe(
                data => {
                    if (data.json().success) {
                        this.paymentSuccess(true);
                    }
                }, error =>  console.log(error.json())
            );
    }

    keypadUpdated(keypadValue: number) {
        this.paymentTotal = keypadValue;
    }

    private paymentSuccess(synced: boolean) {
        const change = this.paymentTotal > 0 ? this.paymentTotal - this.checkoutPrice : 0;
        this.checkoutService.clearOrders();
        this.transactionService.saveTransaction(
            new Transaction(Date.now(), this.activePayment, this.checkoutPrice, this.paymentTotal, this.orders, synced)
        );
        this.nav.push(ResultPage, { change });
    }

    ionViewCanEnter() {
        return this.getPayments();
    }

    ngOnDestroy() {
        this.connectSub.unsubscribe();
    }
}
