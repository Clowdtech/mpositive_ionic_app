import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { CheckOutPage, LogInPage } from '../pages';
import { AuthProvider, SyncProvider } from "../providers";

@Component({
  templateUrl: 'app.html',
})
export class MyApp implements OnInit{

  @ViewChild(Nav) nav: Nav;
  rootPage: Component;

  constructor(public platform: Platform, private auth: AuthProvider, private syncProvider: SyncProvider) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  ngOnInit() {
    if (this.auth.hasCredentials()) {
      this.auth.makeAuth().then(() => {
        this.syncProvider.checkChanges().setSync();
        this.rootPage = CheckOutPage;
      });
    } else {
      this.rootPage = LogInPage;
    }
  }

}
