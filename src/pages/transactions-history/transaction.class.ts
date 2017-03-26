import { Injectable } from '@angular/core'
import { OrderItem } from "../../components/check-out-list";


@Injectable()
export class Transaction {
    constructor(public timestamp: number, public paymentType: string, public total: number, public paidTotal: number,
      public orders: Array<OrderItem>) {}
}