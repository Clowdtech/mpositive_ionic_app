import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Validators,  FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from "../../providers";
import { CheckOutPage } from "../check-out/check-out";
import {Utils} from "../../services/utils";
import {ProductService, CategoryService, PaymentService} from "../../services";
import { RegisterPage } from "../";

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  private credentials: FormGroup;

  constructor(private formBuilder: FormBuilder, private authProvider: AuthProvider, private nav: NavController,
              private utils: Utils, private productService: ProductService, private categoryService: CategoryService,
              private paymentService: PaymentService) {
    this.credentials = this.formBuilder.group({
      access_key: ['KHSiPh9m', Validators.required],
      access_secret: ['YRxLgzi5', Validators.required],
    });
  }

  logIn() {
      this.authProvider.makeAuth(this.credentials.value).then(() => {
        this.authProvider.logIn();
        this.productService.logIn();
        this.categoryService.logIn();
        this.paymentService.logIn();
        this.nav.setRoot(CheckOutPage);
      }, res => {
        this.utils.showToast(res.error);
      });
  }

  openRegister() {
    this.nav.setRoot(RegisterPage);
  }
}
