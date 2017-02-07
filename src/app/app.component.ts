import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { CheckOutPage, MyProductsPage } from '../pages';
import { AuthProvider } from "../providers";
import {TransactionsHistoryPage} from "../pages/transactions-history/transactions-history";

@Component({
  templateUrl: 'app.html',
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any = CheckOutPage;
  private pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, private auth: AuthProvider) {
    this.initializeApp();

    this.pages = [
      { title: 'Checkout', component: CheckOutPage },
      { title: 'My Products', component: MyProductsPage },
      { title: 'Transaction reports', component: TransactionsHistoryPage }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
