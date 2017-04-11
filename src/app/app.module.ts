import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CheckOutPage, MyProductsPage, CategoryDetailPage, PickColorPage, ProductDetailPage, PickCategoryPage,
  TransactionsHistoryPage ,RecordPaymentPage, TransactionDetailPage, ProductsHistoryPage, LogInPage, ResultPage,
  UpdatedPage } from '../pages';
import { CheckOutListComponent } from '../components/check-out-list';
import { VerticalMenuComponent } from "../components/vertical-menu";
import { CategoryComponent } from "../components/category";
import { ProductComponent } from "../components/product";
import { KeypadComponent } from "../components/keypad";
import { requestOptionsProvider, AuthProvider, CategoryProvider, ProductProvider, PaymentProvider,
  SyncProvider } from "../providers";
import { CategoryService, ProductService, CheckoutService, PaymentService, Utils, TransactionsService,
  NetworkService} from "../services";
import { ScrollHeight } from "../components/scroll-height/scroll-height";
import { ConvertUnits } from "../pipes";
import { CloseModal } from "../components/close-modal/close-modal";
import { Network } from '@ionic-native/network';

const components: Array<any> = [
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
  ResultPage,
  UpdatedPage,
  CheckOutListComponent,
  VerticalMenuComponent,
  CategoryComponent,
  KeypadComponent,
  ProductComponent,
];

const providers: Array<any> = [
  Network,
  NetworkService,
  AuthProvider,
  CategoryService,
  ProductService,
  CheckoutService,
  PaymentService,
  TransactionsService,
  PaymentProvider,
  CategoryProvider,
  ProductProvider,
  requestOptionsProvider,
  SyncProvider,
  Utils,
  ConvertUnits
];

@NgModule({
  declarations: components.concat([
    ScrollHeight,
    CloseModal
  ]),
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md'
    }),
    HttpModule,
    FormsModule
  ],
  exports: [ScrollHeight],
  bootstrap: [IonicApp],
  entryComponents: components,
  providers: providers.concat([
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ])
})
export class AppModule {}
