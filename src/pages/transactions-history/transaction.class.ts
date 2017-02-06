import { Injectable } from '@angular/core'


@Injectable()
export class Transaction {
    constructor(public timestamp: number, public paymentType: string, public total: number) {

    }
}