import {Component, Output, EventEmitter, Input, OnInit} from '@angular/core';
import {OrderItem} from './orderItem.class';
import {ProductService, CheckoutService} from "../../services";
import {Product} from "../product";

@Component({
    selector: 'check-out-list',
    templateUrl: 'check-out-list.html'
})
export class CheckOutListComponent implements OnInit {

    @Input() readOnly: boolean;
    @Input() settledOrders: Array<OrderItem>;

    @Output() ordersChanged = new EventEmitter();

    orderItems: Array<OrderItem>;
    private isEditable: boolean;
    private currency: string = '£';

    constructor(private productService: ProductService, private checkoutService: CheckoutService) {

    }

    productSelected(product: Product) {
        if (!product) return;
        let item;
        const ind = this.orderItems.findIndex((orderItem) => {
            return orderItem.uid === product.uid || orderItem.name === product.name;
        });
        if (ind === -1) {
            item = new OrderItem(product.uid, product.name, 0, product.price, this.currency);
            this.orderItems.push(item);
        } else {
            item = this.orderItems[ind];
        }
        this.changeAmount(item, true);
    }

    changeAmount(orderItem: OrderItem, increase: boolean) {
        if (!this.isEditable) return;
        let amount = orderItem.amount;
        increase ? amount++ : (amount > 0) ? amount-- : null;
        orderItem.amount = amount;
        this.checkoutService.setOrders(this.orderItems);
        this.ordersChanged.emit(this.orderItems);
    }

    clearOrders() {
        this.orderItems = [];
        this.checkoutService.setOrders(null);
        this.ordersChanged.emit(this.orderItems);
    }

    enableEditing(enable: boolean) {
        this.isEditable = enable;
    }

    ngOnInit(): void {
        this.enableEditing(!this.readOnly);
        this.orderItems = this.settledOrders || CheckoutService.getOrders() || [];
        this.ordersChanged.emit(this.orderItems);
    }

}
