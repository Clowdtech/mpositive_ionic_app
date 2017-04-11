import { Injectable, forwardRef, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { appConfig } from "../app/config";
import { AuthProvider } from "./auth.provider";
import { NetworkService } from "../services";

@Injectable()
export class SyncProvider {

  private syncDelay = 60000;

  constructor(private http: Http, @Inject(forwardRef(() => AuthProvider)) private auth,
              @Inject(forwardRef(() => NetworkService)) private networkService) {

    this.networkService.connectSubscription.subscribe(() => {
      this.setSync();
    });

    this.networkService.disconnectSubscription.subscribe(() => {
      this.clearSync();
    });
  }

  private syncInterval: number;

  public setSync() {
    this.syncInterval = setInterval(() => {
      this.checkChanges();
    }, this.syncDelay);
  }

  public clearSync() {
    clearInterval(this.syncInterval);
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
    // console.log(changes);
  }

}
