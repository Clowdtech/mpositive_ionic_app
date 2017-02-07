import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import { appConfig } from '../app/config';
import { Utils } from "../services/utils";

@Injectable()
export class AuthProvider {

  public authObserver: Observable<Response>;

  private access_key: string = '8bwyBvZ3';
  private access_secret: string = 'tmEgGfHK';
  private uid: string;
  private token: string;

  constructor(private http: Http, public utils: Utils) {}

  public makeAuth() {
    let params = new URLSearchParams();
    params.set('access_key', this.access_key);
    params.set('access_secret', this.access_secret);
    this.authObserver = this.http.post(`${appConfig.auth_url}?${params}`, null);
    this.authObserver.subscribe(
        data => {
            const res = data.json();
            this.uid = res.uid;
            this.token = res.token;
            this.utils.showToast('Authorization succeeded');
        },
        error => {
            console.log(error.json());
        }
    );
    return this.authObserver;
  }

  public getToken() {
    return this.token;
  }

}
