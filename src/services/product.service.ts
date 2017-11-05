import { Injectable } from '@angular/core';
import { Product } from "../components/product";
import { ProductProvider } from "../providers";
import { NetworkService, AuthService } from "../services";
import { BehaviorSubject } from "rxjs/BehaviorSubject"

@Injectable()
export class ProductService{

    private products: Array<Product>;
    private storagePath: string;
    private connectSub;
    private disconnectSub;

    public productUpdated;
    
    constructor(private auth: AuthService,
        private productProvider: ProductProvider,
        private networkService: NetworkService) {

        this.storagePath = `mp_products_`;

        // If authorized get latest products and subscribe to connection events
        if (this.auth.hasCredentials()) {
            this.getProducts();
            this.subWhenConnected();
            this.subWhenDisconnected();

            this.productUpdated = new BehaviorSubject(this.products);
        }
    }

    /**
     * Parse getProducts data and convert to products object
     * @param productsResponseArray
     */
    public setProducts(productsResponseArray) {
        this.products = productsResponseArray.map((product) => {
            if (product instanceof Product) return product;
            return new Product(product.uid, product.name, product.description,
                product.price, product.background_color, product.font_color, product.category_id, product.created_at);
        });

        // each time products received from server save them to cache
        this.saveCache();
    }

    /**
     * Update products with certain product (add/replace)
     * @param product
     */
    public updateProducts(product: Product) {
        const ind =  this.products.findIndex((prod) => {
            return prod.uid === product.uid && prod.name === product.name;
        });
        if (ind === -1){
            this.products.push(product);
        } else{
            this.products[ind] = product;
        }

        // notify all subscribers about products changes
        this.productUpdated.next(this.products);

        // each time products are modified save them to cache
        this.saveCache();
    }

    /**
     * Get products from service cache or latest from server or cached from storage
     * @returns {Promise<T>}
     */
    public getProducts() : Promise<any>  {
        return new Promise((resolve, reject) => {
            // return already existed products
            if (this.products) {
                resolve(this.products);
                return;
            }

            // if no available products get latest one or get from cache depends on connection
            if (navigator.onLine) {
                this.pullLatestProducts().then(products => {
                    resolve(products);
                }, res => {
                    reject(res);
                });
            } else {
                this.products = this.getCache();
                resolve(this.products);
            }
        });
    }

    /**
     * Get latest products if authorized
     * @returns {Promise<T>}
     */
    pullLatestProducts() {
        return new Promise((resolve, reject) => {
            // wait while new token and uid are received
            this.auth.authPromise.then(() => {
                this.productProvider.getProducts().subscribe(
                    data => {
                        this.setProducts(data.json());
                        resolve(this.products);
                    }, error => {
                        reject(error.json());
                    }
                );
            }, error => {
                reject(error);
            });
        });
    }

    /**
     * Get cashed products (store when save or lost connection)
     * @returns {Array}
     */
    public getCache() {
        let cache = window.localStorage.getItem(`${this.storagePath}${this.auth.getKey()}`);
        return cache && cache !== 'null' ? JSON.parse(cache) : [];
    }

    /**
     * Save products to cache (store when save or lost connection)
     * @returns {Array}
     */
    public saveCache() {
        if (!this.products) return;
        window.localStorage.setItem(`${this.storagePath}${this.auth.getKey()}`, JSON.stringify(this.products));
    }

    /**
     * Unsubscribe and clear listeners + outdated data
     */
    public logOut() {
        this.products = null;
        this.connectSub.unsubscribe();
        this.disconnectSub.unsubscribe();
        delete this.connectSub;
        delete this.disconnectSub;
    }

    /**
     * Get latest products and subscribe to connection events
     */
    public logIn() {
        this.getProducts();
        this.subWhenConnected();
        this.subWhenDisconnected();
    }

    /**
     * Subscribe to connection becomes available
     */
    private subWhenConnected() {
        if (this.connectSub) return;
        this.connectSub = this.networkService.connectSubscription.subscribe(() => {
            this.pullLatestProducts();
        });
    }

    /**
     * Subscribe to connection is lost
     */
    private subWhenDisconnected() {
        if (this.disconnectSub) return;
        this.disconnectSub = this.networkService.disconnectSubscription.subscribe(() => {
            // save latest products to cache to use when offline
            this.saveCache();

            // logOut products because are out dated (product component still has latest products)
            this.products = null;
        });
    }
}
