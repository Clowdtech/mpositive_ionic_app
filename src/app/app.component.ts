import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CheckOutPage, LogInPage } from '../pages';
import { AuthProvider, SyncProvider } from "../providers";

@Component({
  templateUrl: 'app.html',
})
export class MyApp implements OnInit {

  @ViewChild(Nav) nav: Nav;
  rootPage: Component;

  public splashScreen: SplashScreen;
  public statusBar: StatusBar;

  constructor(public platform: Platform, private auth: AuthProvider, private syncProvider: SyncProvider) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.statusBar) this.statusBar.styleDefault();
      if (this.splashScreen) this.splashScreen.hide();
    });
  }

  ngOnInit() {
    if (!this.auth.hasCredentials()) {
      // log out user if he wasn't logged in last time
      this.rootPage = LogInPage;
      return;
    }

    // auth user just if internet connection is available
    if (navigator.onLine) {
      this.auth.authPromise.then(() => {
        this.syncProvider.checkChanges().setSync();
        this.rootPage = CheckOutPage;
      }, () => {
        // log out user if error received during auth
        this.rootPage = LogInPage;
      });
    } else {
      // open Check out page if no internet with limited access to app
      this.rootPage = CheckOutPage;
    }
  }
}
