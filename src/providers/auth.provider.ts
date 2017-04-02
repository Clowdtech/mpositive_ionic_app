import { Injectable, forwardRef, Inject } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { appConfig } from '../app/config';
import { Utils } from "../services/utils";
import { CategoryService, ProductService } from "../services";

@Injectable()
export class AuthProvider {

  private access_key: string;
  private access_secret: string;
  private uid: string;
  private token: string;

  constructor(private http: Http, public utils: Utils, @Inject(forwardRef(() => CategoryService)) private categoryService,
    @Inject(forwardRef(() => ProductService)) private productService) {}

  public makeAuth() {
      return new Promise((resolve, reject) => {
        let params = new URLSearchParams();
        params.set('access_key', this.access_key);
        params.set('access_secret', this.access_secret);
        this.http.post(`${appConfig.auth_url}`, null, { search: params}).subscribe(
            data => {
                const res = data.json();
                this.uid = res.uid;
                this.token = res.token;
                this.utils.showToast('Authorization succeeded');
                resolve(res);
            },
            error => {
                reject(error.json());
            }
        );
      });
  }

  public getToken() {
    return this.token;
  }
  public getUID() {
    return this.uid;
  }

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
      this.setCredentials({access_key: '', access_secret: ''});
      this.categoryService.clear();
      this.productService.clear();
  }

}
