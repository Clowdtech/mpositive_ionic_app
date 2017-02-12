import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Validators,  FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from "../../providers";
import { CheckOutPage } from "../check-out/check-out";

@Component({
  selector: 'page-log-in',
  templateUrl: 'log-in.html'
})
export class LogInPage {

  private credentials: FormGroup;

  constructor(private formBuilder: FormBuilder, private authProvider: AuthProvider, private nav: NavController) {
    this.credentials = this.formBuilder.group({
      access_key: ['8bwyBvZ3', Validators.required],
      access_secret: ['tmEgGfHK', Validators.required],
    });
  }

  logIn() {
    this.authProvider.setCredentials(this.credentials.value);
    this.authProvider.makeAuth().then(() => {
      this.nav.setRoot(CheckOutPage);
    });
  }

}
