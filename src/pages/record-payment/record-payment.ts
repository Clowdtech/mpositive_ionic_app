import { Component } from '@angular/core';
import { NavParams, ToastController } from 'ionic-angular';
import { OrderItem } from "../../components/check-out-list/orderItem.class";
import { PaymentProvider } from "../../providers";
import { PaymentService } from "../../services";
import { PaymentType } from "./payment";
import { appConfig } from "../../app/config";
import {PaymentData} from "./paymentData";

@Component({
    selector: 'page-record-payment',
    templateUrl: 'record-payment.html'
})
export class RecordPaymentPage {

    private checkoutPrice: number;
    private paymentTotal: number = 0;
    private currency: string = appConfig.defaultCurrency;

    private activePayment: PaymentType;

    protected orders: Array<OrderItem>;
    private payments: Array<PaymentType>;

    constructor(private navParams: NavParams, private paymentProvider: PaymentProvider,
                private paymentService: PaymentService, private toastCtrl: ToastController) {
        this.orders = this.navParams.get('orders');
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
        if (this.activePayment.name !== 'Card' && (this.paymentTotal < this.checkoutPrice || !this.paymentTotal)) {
            let toast = this.toastCtrl.create({
                message: 'Please type correct received total value',
                duration: 3000,
                position: 'top'
            });
            toast.present();
            return;
        }
        this.paymentProvider.registerPayment(new PaymentData(this.orders, this.paymentTotal, this.activePayment))
            .subscribe((data) => {
                console.log(data.json());
            });
    }

    keypadUpdated(keypadValue: { integer: number, float: number }) {
        this.paymentTotal = parseFloat(`${keypadValue.integer}.${keypadValue.float}`);
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
