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
import { requestOptionsProvider, AuthProvider, CategoryProvider, ProductProvider, PaymentProvider,
  SyncProvider } from "../providers";
import { CategoryService, ProductService, CheckoutService, PaymentService, Utils, TransactionsService } from "../services";
import { ScrollHeight } from "../components/scroll-height/scroll-height";
import { ConvertUnits } from "../pipes";

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
    ProductComponent,
    ScrollHeight
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      mode: 'md'
    }),
    HttpModule,
    FormsModule
  ],
  exports: [ScrollHeight],
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
    ProductComponent,
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
    SyncProvider,
    Utils,
    ConvertUnits
  ]
})
export class AppModule {}
