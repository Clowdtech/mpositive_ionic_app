import { Injectable, forwardRef, Inject } from '@angular/core';
import { Headers, URLSearchParams } from '@angular/http';
import { appConfig } from "../app/config";

import "rxjs/add/operator/map";
import { Product } from "../components/product";
import { AuthService } from "../services";
import { HttpInterceptor } from "./app.http.interceptor";

@Injectable()
export class ProductProvider {

  constructor(private http: HttpInterceptor, @Inject(forwardRef(() => AuthService)) private auth) {}

  getProducts() {
    const headers = new Headers();
    headers.append('Authorization', `Bearer:${ this.auth.getToken() }`);
    return this.http.get(appConfig.products_url, { headers })/*.map((response: Response) => { response.json() })*/;
  }

  saveProduct(product: Product) {
    const token = this.auth.getToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer:${token}`);
    let params = new URLSearchParams();
    params.set('name', product.name);
    params.set('description', product.description);
    params.set('price', product.price);
    params.set('category_id', product.categoryId);
    params.set('background_color', product.bgColor);
    params.set('font_color', product.txtColor);
    if (product.uid) {
      return this.http.put(`${appConfig.product_url}/${product.uid || ''}?${params}`, null, { headers })/*.map((response: Response) => { response.json() })*/;
    } else {
      return this.http.post(`${appConfig.product_url}?${params}`, null, { headers })/*.map((response: Response) => { response.json() })*/;
    }

  }

}
