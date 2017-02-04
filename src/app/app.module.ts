import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { CheckOutPage, MyProductsPage, CategoryDetailPage, PickColorPage, ProductDetailPage, PickCategoryPage
        ,RecordPaymentPage } from '../pages';
import { CheckOutListComponent } from '../components/check-out-list';
import { VerticalMenuComponent } from "../components/vertical-menu";
import { CategoryComponent } from "../components/category";
import { ProductComponent } from "../components/product";
import { KeypadComponent } from "../components/keypad";
import { requestOptionsProvider, AuthProvider, CategoryProvider, ProductProvider, PaymentProvider } from "../providers";
import { CategoryService, ProductService, CheckoutService, PaymentService } from "../services";

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
    CheckOutListComponent,
    VerticalMenuComponent,
    CategoryComponent,
    KeypadComponent,
    ProductComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
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
    CheckOutListComponent,
    VerticalMenuComponent,
    CategoryComponent,
    KeypadComponent,
    ProductComponent
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    CategoryProvider,
    ProductProvider,
    requestOptionsProvider,
    PaymentProvider,
    CategoryService,
    ProductService,
    CheckoutService,
    PaymentService
  ]
})
export class AppModule {}
