import { Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'keypad',
  templateUrl: 'keypad.html'
})
export class KeypadComponent implements OnDestroy, OnInit{

  @Output() keypadUpdated = new EventEmitter();

  numbers: Array<Number>;
  numeric: { integer: number, float: number } = this.clear();
  toFloat: boolean = false;
  zeroForFloat: boolean = false;


  constructor() {
    this.numbers = Array(9).fill(1).map((x,i)=>x+i);
  }

  addNumber(number) {
    if (this.toFloat) {
      if (this.numeric.float.toString().length == 4) return;
      this.numeric.float = (!this.zeroForFloat && this.numeric.float == 0)
          ? (number === 0 ? 0.0 : 1/10 * number) : this.numeric.float + 1/100 * number;
      if (number === 0) this.zeroForFloat = true;
    } else {
      this.numeric.integer = this.numeric.integer * 10 + number;
    }
    this.keypadUpdated.emit(this.calcNumber());
  }

  changeToFloat(toFloat) {
    this.toFloat = toFloat;
  }

  clear() {
    this.numeric = {
      integer: 0,
      float: 0
    };
    this.keypadUpdated.emit(this.calcNumber());
    this.zeroForFloat = false;
    this.changeToFloat(false);
    return this.numeric;
  }

  calcNumber() {
    return (this.numeric.integer + this.numeric.float).toFixed(2);
  }

  ngOnInit() {
    this.keypadUpdated.emit(this.calcNumber());
  };

  ngOnDestroy() {
    this.clear();
    this.keypadUpdated.emit(this.calcNumber());
  }

}
