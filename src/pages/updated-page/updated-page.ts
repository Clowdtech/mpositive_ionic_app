import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'updated-page',
  templateUrl: 'updated-page.html'
})
export class UpdatedPage {

  type: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.type = this.navParams.get('type');
  }

  back() {
    this.navCtrl.pop({
      animate: false
    }).then(() => {
      this.navCtrl.pop();
    });
  }

  reopen() {
    this.navCtrl.pop();
  }

}
