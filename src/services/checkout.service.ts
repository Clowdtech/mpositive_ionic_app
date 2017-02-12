import { Injectable } from '@angular/core';
import { OrderItem } from "../components/check-out-list";
import {AuthProvider} from "../providers/auth.provider";

@Injectable()
export class CheckoutService {

    public orderItems: Array<OrderItem> = [];

    private storagePath: string;

    constructor(auth: AuthProvider) {
        this.storagePath = `mp_orders_${auth.getUID()}`;
    }

    setOrders(orderItems: Array<OrderItem>) {
        this.orderItems = orderItems;
        window.localStorage.setItem(this.storagePath, JSON.stringify(orderItems));
    }

    getOrders() {
        const orders = window.localStorage.getItem(this.storagePath);
        return orders ? JSON.parse(orders) : [];
    }


}
