import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
//import { StatusBar, Splashscreen } from 'ionic-native';
import { CheckOutPage, LogInPage } from '../pages';
import { AuthProvider, SyncProvider } from "../providers";
/*import { Network } from '@ionic-native/network';*/

@Component({
  templateUrl: 'app.html',
})
export class MyApp implements OnInit{

  @ViewChild(Nav) nav: Nav;
  rootPage: Component;

  constructor(public platform: Platform, private auth: AuthProvider, private syncProvider: SyncProvider/*,
              private network: Network*/) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.styleDefault();
      //Splashscreen.hide();
    });
  }

  ngOnInit() {

/*    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      // We just got a connection but we need to wait briefly
      // before we determine the connection type.  Might need to wait 
      // prior to doing any api requests as well.
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });*/

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
