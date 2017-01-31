import { Component, EventEmitter, Output } from '@angular/core';
import { appConfig } from "../../app/config";
import { ProductService } from "../../services";
import { Product } from "../product";
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'keypad',
  templateUrl: 'keypad.html'
})
export class KeypadComponent {

  @Output() productSelected = new EventEmitter();

  numbers: Array<Number>;
  currency: string = appConfig.defaultCurrency;
  label: string = '';
  price: { integer: number, float: number } = this.clear();
  toFloat: boolean = false;


  constructor(private productService: ProductService) {
    this.numbers = Array(9).fill(1).map((x,i)=>x+i);
  }

  setLabel(label: string) {
    this.label = label;
  }

  addNumber(number) {
    if (this.toFloat) {
      if (this.price.float.toString().length == 2) return;
      this.price.float = this.price.float * 10 + number;
    } else {
      this.price.integer = this.price.integer * 10 + number;
    }
  }

  changeToFloat(toFloat) {
    this.toFloat = toFloat;
  }

  clear() {
    this.price = {
      integer: 0,
      float: 0
    };
    return this.price;
  }


  add() {
    if (!this.price && !this.label) return;
    this.productSelected.emit(
        new Product(UUID.UUID(), this.label, null, `${this.price.integer}.${this.price.float}`, null, null, null, null)
    );
  }

}
