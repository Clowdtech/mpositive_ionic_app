import { Injectable, forwardRef, Inject } from '@angular/core';
import { Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { appConfig } from "../app/config";
import { AuthService } from "../services";
import { HttpInterceptor } from "./app.http.interceptor";
import {Transaction} from "../pages/transactions-history/transaction.class";

@Injectable()
export class TransactionProvider{

  constructor(public http: HttpInterceptor, @Inject(forwardRef(() => AuthService)) private auth) {}

  makeRefund(transaction: Transaction) {
    console.log(transaction);
      const headers = new Headers();
      headers.append('Authorization', `Bearer:${ this.auth.getToken() }`);
      return this.http.post(`${appConfig.payment_url}/${transaction.uid}/${appConfig.refund_url}`,
          null, {headers});
  }
}
