import { Injectable, forwardRef, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {appConfig} from "../app/config";
import {AuthProvider} from "./auth.provider";

@Injectable()
export class SyncProvider {

  constructor(private http: Http, @Inject(forwardRef(() => AuthProvider)) private auth) {}

  private syncInterval: number;

  public setSync() {
    this.syncInterval = setInterval(() => {
      this.checkChanges();
    }, 60000);
  }

  public checkChanges() {
    const headers = new Headers();
    headers.append('Authorization', `Bearer:${ this.auth.getToken() }`);
    this.http.get(`${appConfig.sync_url}`, { headers }).subscribe((response) => {
      const changes = response.json();
      if (changes.length > 0) {
        this.syncData(changes);
      }
    });
    return this;
  }

  private syncData(changes: Array<any>) {
    changes.forEach(() => {

    });
  }

}
