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


  constructor() {
    this.numbers = Array(9).fill(1).map((x,i)=>x+i);
  }

  addNumber(number) {
    if (this.toFloat) {
      if (this.numeric.float.toString().length == 2) return;
      this.numeric.float = this.numeric.float * 10 + number;
    } else {
      this.numeric.integer = this.numeric.integer * 10 + number;
    }
    this.keypadUpdated.emit(this.numeric);
  }

  changeToFloat(toFloat) {
    this.toFloat = toFloat;
  }

  clear() {
    return this.numeric = {
      integer: 0,
      float: 0
    };
  }

  ngOnInit() {
    this.keypadUpdated.emit(this.numeric);
  };

  ngOnDestroy() {
    this.clear();
    this.keypadUpdated.emit(this.numeric);
  }

}
