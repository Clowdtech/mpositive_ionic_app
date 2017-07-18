import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { appConfig } from '../app/config';

@Injectable()
export class AuthProvider {

  constructor(private http: Http) {}

  /**
   * Request to retrieve new tokens for certain credentials
   * @param credentials
   * @return {Observable<Response>}
   */
  public authorize(credentials: {access_key: string , access_secret: string}) {
    let params = new URLSearchParams();
    params.set('access_key', credentials.access_key);
    params.set('access_secret', credentials.access_secret);
    return this.http.post(`${appConfig.auth_url}`, null, { search: params});
  }

  /**
   * Request to creat new user in back office
   * @param data
   * @return {Observable<Response>}
   */
  public register(data: any) {
    let params = new URLSearchParams();

    params.set('company_name', data.companyName);
    params.set('first_name', data.firstName);
    params.set('last_name', data.lastName);
    params.set('phone_number', data.mobile);
    params.set('contact_email', data.email);
    params.set('password', data.pass);
    params.set('address', `${data.address1} ${data.address2} ${data.town}, ${data.postcode}, ${data.country}`);
    return this.http.post(`${appConfig.register_url}`, null, { search: params});
  }
}
