import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CheckOutPage, LogInPage } from '../pages';
import { SyncProvider } from "../providers";
import { AuthService } from "../services";

@Component({
  templateUrl: 'app.html',
})
export class MyApp implements OnInit {

  @ViewChild(Nav) nav: Nav;
  rootPage: Component;

  public splashScreen: SplashScreen;
  public statusBar: StatusBar;

  constructor(public platform: Platform, private auth: AuthService, private syncProvider: SyncProvider,
              public _SplashScreen: SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.statusBar) this.statusBar.styleDefault();
        setTimeout(() => {
          this._SplashScreen.hide();
        }, 100);
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
