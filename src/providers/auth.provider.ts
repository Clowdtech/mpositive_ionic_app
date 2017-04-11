import { Injectable, forwardRef, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { appConfig } from '../app/config';
import { Utils } from "../services/utils";
import { NetworkService } from "../services";

@Injectable()
export class AuthProvider {

  private access_key: string;
  private access_secret: string;
  private uid: string;
  private token: string;
  private connectSub;
  private disconnectSub;

  authPromise: Promise<any>;

  constructor(private http: Http, public utils: Utils,
              @Inject(forwardRef(() => NetworkService)) private networkService) {

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
          let params = new URLSearchParams();
          params.set('access_key', credentials.access_key);
          params.set('access_secret', credentials.access_secret);
          this.http.post(`${appConfig.auth_url}`, null, { search: params}).subscribe(
              data => {
                  const res = data.json();
                  this.uid = res.uid;
                  this.token = res.token;

                  // save latest valid credentials
                  this.setCredentials(credentials);
                  this.utils.showToast('Authorization succeeded');

                  resolve(res);
              },
              error => {
                  reject(error.json());
              }
          );
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

  public logOut() {
      this.clearCredentials();
      this.clearToken();
      this.connectSub.unsubscribe();
      this.disconnectSub.unsubscribe();
      delete this.connectSub;
      delete this.disconnectSub;
  }

  public logIn() {
      // subscribe to connection handlers
      this.subWhenConnected();
      this.subWhenDisconnected();
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

  private clearCredentials() {
      delete this.access_secret;
      delete this.access_key;
      window.localStorage.removeItem('mp_credentials');
  }

  private clearToken() {
      delete this.token;
      delete this.uid;
  }
}
