import { Injectable } from '@angular/core';
import { Product } from "../components/product";

@Injectable()
export class ProductService {

    private products: Array<Product>;

    constructor() {}

    public setProducts(productsResponseArray) {
        this.products = productsResponseArray.map((product) => {
            if (product instanceof Product) return product;
            return new Product(product.uid, product.name, product.description,
                product.price, product.background_color, product.font_color, product.category_id, product.created_at);
        });
    }

    public updateProducts(product: Product) {
        const ind =  this.products.findIndex((prod) => {
            return prod.uid === product.uid && prod.name === product.name;
        });
        if (ind === -1){
            this.products.push(product);
        } else{
            this.products[ind] = product;
        }
    }

    public getProducts() {
        return this.products;
    }

    public clear() {
        this.products = null;
    }

}
