import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-pick-color',
  templateUrl: 'pick-color.html'
})
export class PickColorPage {

  colors: Array<string> = [
    '#000', '#fff', '#FF2644', '#030997', '#FF6B0C'
  ];

  constructor(private viewCtrl: ViewController) {

  }

  selectColor(color: string) {
    this.viewCtrl.dismiss(color);
  }

}
