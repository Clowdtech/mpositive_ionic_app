import { Injectable } from '@angular/core';
import { OrderItem } from "../components/check-out-list";
import { AuthService } from "./auth.service";

@Injectable()
export class CheckoutService {

    public orderItems: Array<OrderItem> = [];

    private storagePath: string;

    constructor(private auth: AuthService) {
        this.storagePath = `mp_orders_`;
    }

    setOrders(orderItems: Array<OrderItem>) {
        if (!this.orderItems) return;
        this.orderItems = orderItems;
        window.localStorage.setItem(`${this.storagePath}${this.auth.getKey()}`, JSON.stringify(orderItems));
    }

    getOrders() {
        const orders = window.localStorage.getItem(`${this.storagePath}${this.auth.getKey()}`);
        return orders ? JSON.parse(orders) : [];
    }

    clearOrders() {
        this.orderItems = [];
        window.localStorage.removeItem(`${this.storagePath}${this.auth.getKey()}`);
    }


}
