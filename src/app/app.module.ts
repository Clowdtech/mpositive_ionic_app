import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CheckOutPage, MyProductsPage, CategoryDetailPage, PickColorPage, ProductDetailPage, PickCategoryPage,
  TransactionsHistoryPage ,RecordPaymentPage, TransactionDetailPage, ProductsHistoryPage, LogInPage, ResultPage,
  UpdatedPage, RegisterPage, Settings } from '../pages';
import { CheckOutListComponent } from '../components/check-out-list';
import { VerticalMenuComponent } from "../components/vertical-menu";
import { CategoryComponent } from "../components/category";
import { ProductComponent } from "../components/product";
import { KeypadComponent } from "../components/keypad";
import { CategoryService, ProductService, CheckoutService, PaymentService, Utils, TransactionsService,
  NetworkService, AuthService, UserService} from "../services";
import { requestOptionsProvider, CategoryProvider, ProductProvider, PaymentProvider,
  SyncProvider, AuthProvider, UserProvider, TransactionProvider } from "../providers";
import { ScrollHeight } from "../components/scroll-height/scroll-height";
import { ConvertUnits } from "../pipes";
import { CloseModal } from "../components/close-modal/close-modal";
import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { HttpInterceptor } from "../providers/app.http.interceptor";
import { XHRBackend, RequestOptions }
    from '@angular/http';

export function httpConfig (backend: XHRBackend, defaultOptions: RequestOptions) {
    return new HttpInterceptor(backend, defaultOptions);
}

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
    ResultPage,
    UpdatedPage,
    RegisterPage,
    Settings,
    CheckOutListComponent,
    VerticalMenuComponent,
    CategoryComponent,
    KeypadComponent,
    ProductComponent,
    ScrollHeight,
    CloseModal,
    ConvertUnits,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      mode: 'md',
      scrollPadding: false,
      scrollAssist: false,
      autoFocusAssist: false
    }),
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
    ResultPage,
    UpdatedPage,
    RegisterPage,
    Settings,
    CheckOutListComponent,
    VerticalMenuComponent,
    CategoryComponent,
    KeypadComponent,
    ProductComponent
  ],
  providers: [
    Network,
    AuthProvider,
    AuthService,
    NetworkService,
    CategoryService,
    ProductService,
    CheckoutService,
    PaymentService,
    TransactionsService,
    UserService,
    PaymentProvider,
    CategoryProvider,
    ProductProvider,
    requestOptionsProvider,
    SyncProvider,
    UserProvider,
    TransactionProvider,
    Utils,
    Keyboard,
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    {
      provide: HttpInterceptor,
      useFactory: httpConfig,
      deps: [ XHRBackend, RequestOptions]
    }
  ]
})
export class AppModule {}
