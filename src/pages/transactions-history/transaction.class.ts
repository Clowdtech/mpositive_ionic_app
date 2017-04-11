import { Injectable } from '@angular/core'
import { OrderItem } from "../../components/check-out-list";
import {PaymentType} from "../record-payment/payment";

/**
 * @class Model for single transaction with all details
 */
@Injectable()
export class Transaction {
    constructor(public timestamp: number, public paymentType: PaymentType, public total: number, public paidTotal: number,
      public orders: Array<OrderItem>, public synced: boolean) {}
}