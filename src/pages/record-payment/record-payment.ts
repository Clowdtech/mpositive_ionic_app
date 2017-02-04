import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { OrderItem } from "../../components/check-out-list/orderItem.class";
import { PaymentProvider } from "../../providers";
import { PaymentService } from "../../services";
import { PaymentType } from "./payment";

@Component({
    selector: 'page-record-payment',
    templateUrl: 'record-payment.html'
})
export class RecordPaymentPage {

    protected orders: Array<OrderItem>;
    private checkoutPrice: number;
    private payments: Array<PaymentType>;
    private activePayment: PaymentType;

    constructor(private navParams: NavParams, private paymentProvider: PaymentProvider,
                private paymentService: PaymentService) {
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
        console.log(this.activePayment);
    }

    ionViewCanEnter() {
        // TODO try not use promise but return true/false
        // this.nav.push(PAGE).catch(()=>{});
        return this.paymentProvider.getPayments().then(
            (data) => {
                this.paymentService.setPayments(data);
                this.getPayments();
            }
        );
    }
}
