import { Injectable, forwardRef, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { appConfig } from "../app/config";
import { AuthService } from "../services";
import { PaymentData } from "../pages/record-payment/paymentData.class";
import { HttpInterceptor } from "./app.http.interceptor";

@Injectable()
export class PaymentProvider{

  constructor(public http: HttpInterceptor, @Inject(forwardRef(() => AuthService)) private auth) {}

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
