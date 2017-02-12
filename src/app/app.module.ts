import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CheckOutPage, MyProductsPage, CategoryDetailPage, PickColorPage, ProductDetailPage, PickCategoryPage,
  TransactionsHistoryPage ,RecordPaymentPage, TransactionDetailPage, ProductsHistoryPage, LogInPage } from '../pages';
import { CheckOutListComponent } from '../components/check-out-list';
import { VerticalMenuComponent } from "../components/vertical-menu";
import { CategoryComponent } from "../components/category";
import { ProductComponent } from "../components/product";
import { KeypadComponent } from "../components/keypad";
import { requestOptionsProvider, AuthProvider, CategoryProvider, ProductProvider, PaymentProvider } from "../providers";
import { CategoryService, ProductService, CheckoutService, PaymentService, Utils, TransactionsService } from "../services";

@NgModule({
  declarations: [
    MyApp,
    CheckOutPage,
    MyProductsPage,
    CategoryDetailPage,
    PickColorPage,
    ProductDetailPage,
    PickCategoryPage,
    RecordPaymentPage,
    TransactionsHistoryPage,
    TransactionDetailPage,
    ProductsHistoryPage,
    LogInPage,
    CheckOutListComponent,
    VerticalMenuComponent,
    CategoryComponent,
    KeypadComponent,
    ProductComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule,
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    CheckOutPage,
    MyProductsPage,
    CategoryDetailPage,
    PickColorPage,
    ProductDetailPage,
    PickCategoryPage,
    RecordPaymentPage,
    TransactionsHistoryPage,
    TransactionDetailPage,
    ProductsHistoryPage,
    LogInPage,
    CheckOutListComponent,
    VerticalMenuComponent,
    CategoryComponent,
    KeypadComponent,
    ProductComponent
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    CategoryService,
    ProductService,
    CheckoutService,
    PaymentService,
    TransactionsService,
    AuthProvider,
    PaymentProvider,
    CategoryProvider,
    ProductProvider,
    requestOptionsProvider,
    Utils
  ]
})
export class AppModule {}
