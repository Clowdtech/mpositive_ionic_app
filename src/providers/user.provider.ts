import { Injectable, Inject, forwardRef } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { appConfig } from '../app/config';
import { AuthService } from "../services/auth.service";

@Injectable()
export class UserProvider {

  constructor(private http: Http,  @Inject(forwardRef(() => AuthService)) private auth) {}

  /**
   * Get all available data for user
   * @return {Observable<Response>}
   */
  public getUser(token: string) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer:${ token }`);
    return this.http.get(`${appConfig.user_info_url}`, {headers});
  }

    /**
     * Send request to reset pass (user will receive email with link
     * to reset password)
     * @return {Observable<Response>}
     */
    public resetPassword(userData: any) {
        const token = this.auth.getToken();
        const headers = new Headers();
        headers.append('Authorization', `Bearer:${token}`);

        const email = userData.customer.contact_email;
        return this.http.post(`${appConfig.reset_pass_url}`,{email}, {headers});
    }
}
