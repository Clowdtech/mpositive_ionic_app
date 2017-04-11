import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, forwardRef, Inject } from '@angular/core';
import { Product } from "./product.class";
import { Category } from "../category";
import { ProductService, Utils, NetworkService } from "../../services";
import { appConfig } from "../../app/config";
import {AuthProvider} from "../../providers/auth.provider";

@Component({
    selector: 'product',
    templateUrl: 'product.html'
})
export class ProductComponent implements OnInit, OnDestroy {

    @Output() productSelected = new EventEmitter();
    @Input() activeCategory: Category;
    @Input() showAll: boolean = false;
    @Input() compactView: boolean = false;
    products: Array<Product>;
    currency: string = appConfig.defaultCurrency;

    private connectSub;

    constructor(@Inject(forwardRef(() => ProductService)) private productService,
                @Inject(forwardRef(() => Utils)) private utils,
                @Inject(forwardRef(() => NetworkService)) private networkService,
                @Inject(forwardRef(() => AuthProvider)) private auth) {

        // subscribe to connection becomes available to get latest products
        this.connectSub = this.networkService.connectSubscription.subscribe(() => {
            this.auth.authPromise.then(() => {
                this.getProducts();
            });
        });
    }

    /**
     * Emit event to parent component when product is selected
     * @param product
     */
    selectProduct(product: Product) {
        this.productSelected.emit(product);
    }

    /**
     * show all products or products for certain category
     * @returns {any}
     */
    getProducts() {
        this.productService.getProducts().then(products => {
            if (this.showAll) {
                this.products = products;
            } else {
                this.products = products.filter((product) => {
                    return product.categoryId === this.activeCategory.uid;
                });
            }
            if (this.products.length === 0) {
                this.utils.showToast('This category doesn\'t has any products')
            }
        });
    }

    /**
     * Get products from service when component init
     */
    ngOnInit(): void {
        this.getProducts();
    }

    /**
     * Remove listeners and unsubscribe from events
     */
    ngOnDestroy() {
        // remove subscription because component is no longer available
        // and no
        this.connectSub.unsubscribe();
        document.removeEventListener('click', this.selectProduct.bind(null, null));
    }

}
