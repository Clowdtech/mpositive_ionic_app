import { Component, Input } from '@angular/core';
import { CheckOutPage, MyProductsPage, ProductsHistoryPage, TransactionsHistoryPage, LogInPage, Settings } from '../../pages';
import { NavController } from 'ionic-angular';
import { NetworkService, CategoryService, ProductService, PaymentService, AuthService, UserService } from "../../services";

@Component({
  selector: 'vertical-menu',
  templateUrl: 'vertical-menu.html'
})
export class VerticalMenuComponent {

  @Input() nav: NavController;

  pages: Array<{title: string, component: any}>;

  /**
   * menu items available when internet connection
   * @type Array<{title: string, component: any}>
   */
  private onlineMenu : Array<{title: string, component: any}> = [
    { title: 'My Products', component: MyProductsPage },
    { title: 'Product Reports', component: ProductsHistoryPage },
    { title: 'Transaction Reports', component: TransactionsHistoryPage },
    { title: 'Settings', component: Settings }
  ];

  /**
   * menu items available when no internet connection
   * @type Array<{title: string, component: any}>
   */
  private offlineMenu : Array<{title: string, component: any}> = [
    { title: 'Product Reports', component: ProductsHistoryPage },
    { title: 'Transaction Reports', component: TransactionsHistoryPage }
  ];

  constructor(private auth: AuthService, private networkService: NetworkService,
              private categoryService: CategoryService, private productService: ProductService,
              private paymentService: PaymentService, private userService: UserService) {
    this.pages = navigator.onLine ? this.onlineMenu : this.offlineMenu;

    this.networkService.connectSubscription.subscribe(() => {
      this.pages = this.onlineMenu;
    });

    this.networkService.disconnectSubscription.subscribe(() => {
      this.pages = this.offlineMenu;
    });
  }

  /**
   * open certain page when click on menu item
   * @param page
   */
  public openPage(page) {
    this.nav.setRoot(page.component);
  }

  /**
   * open log in page and logOut current user credentials
   */
  public logOut() {
    this.auth.logOut();
    this.categoryService.logOut();
    this.productService.logOut();
    this.paymentService.logOut();
    this.userService.clearUserData();
    this.nav.setRoot(LogInPage);
  }

  public openCheckout() {
    this.nav.setRoot(CheckOutPage);
  }
}
