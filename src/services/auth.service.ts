import { Injectable, Inject, forwardRef } from '@angular/core';
import { Utils, NetworkService } from "./";
import { AuthProvider } from "../providers";
import 'rxjs/Rx';

@Injectable()
export class AuthService {

  private access_key: string;
  private access_secret: string;
  private connectSub;
  private disconnectSub;

  uid: string;
  token: string;
  authPromise: Promise<any>;
  user: Object;

  constructor(private utils: Utils, private authProvider: AuthProvider, private networkService: NetworkService) {
      if (this.hasCredentials()) {
          this.makeAuth({ access_key: this.access_key, access_secret: this.access_secret }).then(null, error => {
              console.log(error);
          });

          this.subWhenConnected();
          this.subWhenDisconnected();
      }
  }

  /**
   * Make request to receive latest token and uid for certain credentials
   * @returns {Promise<T>}
   */
  public makeAuth(credentials: {access_key: string , access_secret: string}) {
    this.authPromise = new Promise((resolve, reject) => {
      if (!(credentials && credentials.access_secret && credentials.access_key)) {
              reject({error: 'No credentials'});
              return;
          }

      if (!navigator.onLine) {
              reject({error: 'No internet connection'});
              return;
          }

      this.authProvider.authorize(credentials).subscribe(data => {
              const res = data.json();

              // save latest token for further user actions
              this.setToken(res.uid, res.token);

              // save device user logged in
              this.setCredentials(credentials);

              this.utils.showToast('Authorization succeeded');
              resolve(res);
          }, error => {
              reject(error.json());
          });
    });
    return this.authPromise;
  }

  public register(data: any) {
      this.authPromise =  new Promise((resolve, reject) => {
        this.authProvider.register(data).subscribe(data => {
          const res = data.json();

          // save temp user token to work with app just after registration
          this.setToken(res.uid, res.token);

          // store initial device data to keep user logged in
          if (res.device) {
            const device = res.device;
            this.setCredentials({
              access_key: device.access_key,
              access_secret: device.access_secret
            })
          }

          resolve();
        }, err => {
          reject(err);
        });
    });

    return this.authPromise;
  }

  public getToken() {
    return this.token;
  }
  public getUID() {
    return this.uid;
  }

  public getKey() {
    return this.access_key;
  }

  /**
   * Store current credentials to know if should log in automatically
   * after refresh
   * @param credentials
   */
  public setCredentials(credentials: {access_key: string , access_secret: string}) {
    this.access_key = credentials.access_key;
    this.access_secret = credentials.access_secret;
    window.localStorage.setItem('mp_credentials', JSON.stringify(credentials));
  }

  public setToken(uid: string, token: string) {
    this.uid = uid;
    this.token = token;
  }

  public getCredentials() {
    let credStr = window.localStorage.getItem('mp_credentials');
    const cred = credStr ? JSON.parse(credStr) : {};

    this.access_secret = cred.access_secret;
    this.access_key = cred.access_key;
    return cred;
  }

  public hasCredentials() {
      this.getCredentials();
      return this.access_key && this.access_secret;
  }

  public hasToken() {
      return this.getToken() && this.getUID()
  }

  public logOut() {
      this.saveLastCredentials();
      this.clearCredentials();
      this.clearToken();
      this.connectSub.unsubscribe();
      this.disconnectSub.unsubscribe();
  }

  public logIn() {
      // subscribe to internet connection handlers
      this.subWhenConnected();
      this.subWhenDisconnected();
  }

  /**
   * Retrieve last saved cred from storage
   * @return {access_key, access_secret}
   */
  public static getLastCredentials() {
      let credStr = window.localStorage.getItem('mp_last_used_credentials');
      return credStr ? JSON.parse(credStr) : {};
  }

  private subWhenConnected() {
      this.connectSub = this.networkService.connectSubscription.subscribe(() => {
          // make auth request for logged in user if connection is re-established
          this.makeAuth(this.getCredentials()).then(null, error => {
              console.log(error);
          });
      });
  }

  private subWhenDisconnected() {
      this.disconnectSub = this.networkService.disconnectSubscription.subscribe(() => {
          // this.clearToken();
      });
  }

  /**
   * Save last used credentials to storage, to use them on login
   */
  private saveLastCredentials() {
      window.localStorage.setItem('mp_last_used_credentials', JSON.stringify({
          access_secret: this.access_secret,
          access_key: this.access_key
      }));
  }

  /**
   * Clear credentials from auth and storage
   */
  private clearCredentials() {
      window.localStorage.removeItem('mp_credentials');
      this.access_secret = '';
      this.access_key = '';
  }

  private clearToken() {
      delete this.token;
      delete this.uid;
  }
}
