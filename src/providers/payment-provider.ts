import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/map';
import { appConfig } from "../app/config";
import { AuthProvider } from "./auth.provider";
import { PaymentData } from "../pages/record-payment/paymentData.class";

@Injectable()
export class PaymentProvider{

  constructor(public http: Http, private auth: AuthProvider) {}

  getPayments() {
    return new Promise((resolve, reject) => {
      const headers = new Headers();
      headers.append('Authorization', `Bearer:${ this.auth.getToken() }`);
      this.http.get(appConfig.payments_url, { headers }).subscribe((data) => {
        resolve(data.json());
      }, (error) => {
        reject(error);
      });
    });
  }

  registerPayment(paymentData: PaymentData) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer:${ this.auth.getToken() }`);
    return this.http.post(`${appConfig.payment_url}`, paymentData,  { headers });
  }

}
