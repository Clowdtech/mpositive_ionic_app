import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-pick-color',
  templateUrl: 'pick-color.html'
})
export class PickColorPage {

  colors: Array<string> = [
    '#e74c3c', '#e67e22', '#f1c40f', '#1abc9c', '#2ecc71', '#3498DB', '#9b59b6', '#34495e',
    '#7f8c8d', '#bdc3c7', '#3b3c3f', '#d2527f', '#3051bf', '#67809f', '#e58b8b', '#6c5c8a'
  ];

  constructor(private viewCtrl: ViewController) {

  }

  selectColor(color: string) {
    this.viewCtrl.dismiss(color);
  }

}
