import { Component, ViewChild } from '@angular/core';
import { appConfig } from "../../app/config";
import { CheckOutListComponent } from "../../components/check-out-list";
import { Product } from "../../components/product";
import { OrderItem } from "../../components/check-out-list";

@Component({
  selector: 'page-check-out',
  templateUrl: 'check-out.html'
})
export class CheckOutPage {

  @ViewChild(CheckOutListComponent)
  private checkOutListComponent: CheckOutListComponent;

  private segment: string;
  private checkoutPrice: number = 0;
  private orders: Array<OrderItem>;

  currency: string = appConfig.defaultCurrency;

  constructor() {
    this.segment = 'category';
  }

  productSelected(product: Product) {
    this.checkOutListComponent.productSelected(product);
  }

  ordersChanged(orders: Array<OrderItem>) {
    this.orders = orders;
    this.calcTotalPrice();
  }

  calcTotalPrice() {
    this.checkoutPrice = 0;
    this.orders.forEach((orderItem: OrderItem) => {
      this.checkoutPrice += parseFloat(orderItem.price) * orderItem.amount
    });
  }

  charge() {

  }

}
