import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators,  FormBuilder, FormGroup } from '@angular/forms';
import { Http, URLSearchParams } from '@angular/http';
import { LogInPage } from "../";
import { appConfig } from "../../app/config";

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private regData: FormGroup;

  steps;
  step: number;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, private http: Http) {
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

  openLogin() {
    this.navCtrl.setRoot(LogInPage);
  }

  register() {
    let params = new URLSearchParams();
    const data = this.regData.value;
    params.set('company_name', data.companyName);
    params.set('first_name', data.firstName);
    params.set('last_name', data.lastName);
    params.set('phone_number', data.mobile);
    params.set('contact_email', data.email);
    params.set('address', `${data.address1} ${data.address2} ${data.town}, ${data.postcode}, ${data.country}`);
    this.http.post(`${appConfig.register_url}`, null, { search: params}).subscribe(
        data => {
          const res = data.json();
          console.log(res);
        },
        error => {

        }
    );
  }
}
