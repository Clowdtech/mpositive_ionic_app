import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { appConfig } from "../app/config";
import { AuthProvider } from "./auth.provider";
import "rxjs/add/operator/map";
import {Category} from "../components/category/category.class";

@Injectable()
export class CategoryProvider {

  constructor(private http: Http, private auth: AuthProvider) {}

  getCategories() {
    const token = this.auth.getToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer:${token}`);
    return this.http.get(appConfig.categories_url, { headers })/*.map((response: Response) => { response.json() })*/;
  }

  saveCategory(category: Category) {
    const token = this.auth.getToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer:${token}`);
    let params = new URLSearchParams();
    params.set('name', category.name);
    params.set('background_color', category.bgColor);
    params.set('font_color', category.txtColor);
    if (category.uid) {
      return this.http.put(`${appConfig.category_url}/${category.uid || ''}?${params}`, null, { headers })/*.map((response: Response) => { response.json() })*/;
    } else {
      return this.http.post(`${appConfig.category_url}?${params}`, null, { headers })/*.map((response: Response) => { response.json() })*/;
    }

  }


}
