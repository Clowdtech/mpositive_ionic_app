import { Component } from '@angular/core';
import { UserService, Utils } from "../../services/";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class Settings{
  private userData: {};

  constructor(private userService: UserService, private utils: Utils) {}

  /**
   * Load view when user related data is received
   */
  ionViewCanEnter() {
    return this.userService.getUser()
        .then(data => this.userData = data)
        .catch(error => console.log(error));
  }

  /**
   * Make reset password call
   */
  resetPassword() {
    this.userService.resetPassword().then(() => {
      this.utils.showToast('Link to reset your password was send to your email')
    }, error => {
        this.utils.showToast(error)
    });
  }
}
