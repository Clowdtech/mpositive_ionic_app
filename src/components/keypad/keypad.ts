import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'keypad',
  templateUrl: 'keypad.html'
})
export class KeypadComponent implements OnDestroy, OnInit{

  @Output() keypadUpdated = new EventEmitter();

  numbers: Array<Number>;
  number: number;
  numeric: { integer: number, float: number } = this.clear();
  toFloat: boolean = false;
  zeroForFloat: boolean = false;


  constructor() {
    this.numbers = Array(9).fill(1).map((x,i)=>x+i);
  }

  addNumber(number) {
    if (this.number == 0) {
      this.number = (1/100 * number)
    } else {
      this.number = this.number * 10 + 0.01 * number;
    }
    this.keypadUpdated.emit(this.calcNumber());
  }

  multiply(number) {
    if (this.number === 0) return;
    this.number *= number;
    this.keypadUpdated.emit(this.calcNumber());
  }

  clear() {
    this.number = 0.00;
    this.keypadUpdated.emit(this.calcNumber());
    return this.numeric;
  }

  calcNumber() {
    return this.number.toFixed(2);
  }

  ngOnInit() {
    this.keypadUpdated.emit(this.calcNumber());
  };

  ngOnDestroy() {
    this.clear();
    this.keypadUpdated.emit(this.calcNumber());
  }

}
