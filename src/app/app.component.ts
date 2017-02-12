import { Component, ViewChild, OnInit } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { CheckOutPage, MyProductsPage, ProductsHistoryPage, TransactionsHistoryPage, LogInPage } from '../pages';
import { AuthProvider } from "../providers";

@Component({
  templateUrl: 'app.html',
})
export class MyApp implements OnInit{

  @ViewChild(Nav) nav: Nav;
  rootPage: Component;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, private auth: AuthProvider) {

    this.initializeApp();

    this.pages = [
      { title: 'Checkout', component: CheckOutPage },
      { title: 'My Products', component: MyProductsPage },
      { title: 'Product Reports', component: ProductsHistoryPage },
      { title: 'Transaction Reports', component: TransactionsHistoryPage }
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

  logOut() {
    this.auth.logOut();
    this.nav.setRoot(LogInPage);
  }

  ngOnInit() {
    if (this.auth.hasCredentials()) {
      this.auth.makeAuth().then(() => {
        this.rootPage = CheckOutPage;
      });
    } else {
      this.rootPage = LogInPage;
    }
  }

}
