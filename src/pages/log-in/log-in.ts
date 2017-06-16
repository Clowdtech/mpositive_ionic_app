import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators,  FormBuilder, FormGroup } from '@angular/forms';
import { CheckOutPage } from "../check-out/check-out";
import { ProductService, CategoryService, PaymentService, Utils, AuthService } from "../../services";
import { RegisterPage } from "../";

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  private credentials: FormGroup;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private nav: NavController,
              private utils: Utils, private productService: ProductService, private categoryService: CategoryService,
              private paymentService: PaymentService) {

    this.credentials = this.formBuilder.group({
      access_key: ['KHSiPh9m', Validators.required],
      access_secret: ['YRxLgzi5', Validators.required],
    });
  }

  logIn() {
      this.auth.makeAuth(this.credentials.value).then(() => {
        this.auth.logIn();
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
