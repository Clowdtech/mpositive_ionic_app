import { Injectable } from '@angular/core';
import { OrderItem } from "../components/check-out-list";

@Injectable()
export class CheckoutService {

    public orderItems: Array<OrderItem> = [];

    constructor() {}

    setOrders(orderItems: Array<OrderItem>) {
        this.orderItems = orderItems;
        window.localStorage.setItem('orders', JSON.stringify(orderItems));
    }

    static getOrders() {
        return JSON.parse(window.localStorage.getItem('orders'));
    }


}
