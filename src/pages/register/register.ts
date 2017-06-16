import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators,  FormBuilder, FormGroup } from '@angular/forms';
import { LogInPage } from "../";
import { ProductService, CategoryService, PaymentService, Utils, AuthService } from "../../services";
import { CheckOutPage } from "../check-out/check-out";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private regData: FormGroup;

  steps;
  step: number;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder,
              private auth: AuthService, private nav: NavController, private utils: Utils,
              private productService: ProductService, private categoryService: CategoryService,
              private paymentService: PaymentService) {

    this.regData = this.formBuilder.group({
      email: ['', Validators.email],
      pass: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      companyName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      town: ['', Validators.required],
      postcode: ['', Validators.required],
      country: ['', Validators.required],
    });

    this.steps = {
      email: 1,
      complete: 2
    };
    this.step = this.steps.email;
  }

  get email(): any { return this.regData.get('email'); }

  completeRegisterData() {
    this.step = this.steps.complete;
  }

  toPrevStep() {
    this.step = this.steps.email;
  }

  openLogin() {
    this.navCtrl.setRoot(LogInPage);
  }

  register() {
    const data = this.regData.value;

    this.auth.register(data).then(() => {
      this.auth.logIn();
      this.productService.logIn();
      this.categoryService.logIn();
      this.paymentService.logIn();

      this.nav.setRoot(CheckOutPage);
    }, res => {
      this.utils.showToast(res.json().error);
    });
  }
}
