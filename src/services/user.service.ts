import { Injectable } from '@angular/core';
import { UserProvider } from "../providers";
import 'rxjs/Rx';
import { AuthService, Utils } from "./";

@Injectable()
export class UserService {

  user: Object;

  constructor(private userProvider: UserProvider, private authService: AuthService, private utils: Utils) {

  }

  public getUser() {
    return new Promise((resolve, reject) => {
      this.userProvider.getUser(this.authService.getToken())
        .subscribe(data => {
            if (data) {
                this.user = data.json();
                resolve(this.user);
                return;
            }
            reject('No user data');
        }, error => {
            this.clearUserData();
            this.utils.showToast(error);
            reject(error);
        }
      )
    });
  }

  public resetPassword() {
    return new Promise((resolve, reject) => {
        this.userProvider.resetPassword(this.user)
            .subscribe(response => resolve(response.json()),
                error => reject(error.json()));
    });
  }

  public clearUserData() {
      this.user = null;
  }
}
