import { Component, Input } from '@angular/core';
import { CheckOutPage, MyProductsPage, ProductsHistoryPage, TransactionsHistoryPage, LogInPage } from '../../pages';
import { AuthProvider } from "../../providers";
import { NavController } from 'ionic-angular';

@Component({
  selector: 'vertical-menu',
  templateUrl: 'vertical-menu.html'
})
export class VerticalMenuComponent {

  @Input() nav: NavController;

  pages: Array<{title: string, component: any}>;

  constructor(private auth: AuthProvider) {
    this.pages = [
      // { title: 'Checkout', component: CheckOutPage },
      { title: 'My Products', component: MyProductsPage },
      { title: 'Product Reports', component: ProductsHistoryPage },
      { title: 'Transaction Reports', component: TransactionsHistoryPage }
    ];
  }

  public openPage(page) {
    this.nav.setRoot(page.component);
  }

  public logOut() {
    this.auth.logOut();
    this.nav.setRoot(LogInPage);
  }

  public openCheckout() {
    this.nav.setRoot(CheckOutPage);
  }

}
