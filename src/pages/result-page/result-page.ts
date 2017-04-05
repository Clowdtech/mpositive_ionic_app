import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CheckOutPage } from "../check-out/check-out";
import { appConfig } from "../../app/config";

@Component({
  selector: 'page-result-page',
  templateUrl: 'result-page.html'
})
export class ResultPage {

  change: number;
  currency: string = appConfig.defaultCurrency;

  constructor(private navCtrl: NavController, private navParams: NavParams) {
    this.change = navParams.get('change') || 0;
  }

  back() {
    this.navCtrl.setRoot(CheckOutPage);
  }

}
