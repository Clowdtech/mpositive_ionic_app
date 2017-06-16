import { Injectable, Inject, forwardRef } from '@angular/core';
import { PaymentType } from "../pages/record-payment/payment";
import { PaymentProvider } from "../providers";
import { NetworkService, AuthService } from "../services";
import { PaymentData } from "../pages/record-payment/paymentData.class";

@Injectable()
export class PaymentService {

    private payments: Array<PaymentType>;
    private storagePath: string;
    private connectSub;
    private disconnectSub;

    private defaultPayments: Array<PaymentType> = [
        {
            id: '1',
            name: 'Card'
        },
        {
            id: '2',
            name: 'Cash'
        },
        {
            id: '3',
            name: 'Others'
        }
    ];

    constructor(@Inject(forwardRef(() => AuthService)) private auth,
                @Inject(forwardRef(() => NetworkService)) private networkService,
                @Inject(forwardRef(() => PaymentProvider)) private paymentProvider) {

        this.storagePath = `mp_payments_`;

        // If authorized get latest products and subscribe to connection events
        if (this.auth.hasCredentials()) {
            this.subWhenConnected();
            this.subWhenDisconnected();
        }
    }

    /**
     * Map payments from response and save to cache
     * @param paymentsResponseArray
     */
    setPayments(paymentsResponseArray) {
        this.payments = paymentsResponseArray.map((payment) => {
            if (payment instanceof PaymentType) return payment;
            return new PaymentType(payment.id, payment.name);
        });

        this.saveCache();
    }

    /**
     * Get payments from service cache, or server or storage or return default
     * @returns {Promise<T>}
     */
    getPayments() {
        return new Promise((resolve, reject) => {
            // return already existed payments
            if (this.payments) {
                resolve(this.payments);
                return;
            }

            // if no available payments get latest one or get from cache depends on connection
            if (navigator.onLine) {
                this.pullLatestPayments().then(categories => {
                    resolve(categories);
                }, res => {
                    console.log(res);
                    // if error return default payments
                    resolve(this.defaultPayments);
                });
                return;
            } else {
                this.payments = this.getCache();
                resolve(this.payments);
            }
        });
    }

    /**
     * record certain payment
     */
    registerPayment(payment: PaymentData) {
        return this.paymentProvider.registerPayment(payment);
    }

    saveCache() {
        if (!this.payments) return;
        window.localStorage.setItem(`${this.storagePath}${this.auth.getKey()}`, JSON.stringify(this.payments));
    }

    getCache() {
        let cache = window.localStorage.getItem(`${this.storagePath}${this.auth.getKey()}`);
        return cache && cache !== 'null' ? JSON.parse(cache) : this.defaultPayments;
    }

    logIn() {
        this.subWhenConnected();
        this.subWhenDisconnected();
    }

    logOut() {
        this.payments = null;
        this.connectSub.unsubscribe();
        this.disconnectSub.unsubscribe();
        delete this.connectSub;
        delete this.disconnectSub;
    }

    /**
     * Pull latest payments from server
     * @returns {Promise<T>}
     */
    private pullLatestPayments() {
        return new Promise((resolve, reject) => {
            // wait while new token and uid are received
            this.auth.authPromise.then(() => {
                this.paymentProvider.getPayments().then(
                    data => {
                        this.setPayments(data);
                        resolve(this.payments);
                    }, error => {
                        reject(error.json());
                    }
                );
            }, error => {
                reject(error);
            });
        });
    }

    private subWhenConnected() {
        if (this.connectSub) return;
        this.connectSub = this.networkService.connectSubscription.subscribe(() => {
            this.pullLatestPayments();
        });
    }

    private subWhenDisconnected() {
        if (this.disconnectSub) return;
        this.disconnectSub = this.networkService.disconnectSubscription.subscribe(() => {
            // save latest products to cache to use when offline
            this.saveCache();

            // logOut products because are out dated (product component still has latest products)
            this.payments = null;
        });
    }

}
