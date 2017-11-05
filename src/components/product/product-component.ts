import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, forwardRef, Inject, NgZone, ChangeDetectorRef } from '@angular/core';
import { Product } from "./product.class";
import { Category } from "../category";
import { ProductService, Utils, NetworkService, AuthService } from "../../services";
import { appConfig } from "../../app/config";

@Component({
    selector: 'product',
    templateUrl: 'product.html'
})
export class ProductComponent implements OnInit, OnDestroy {

    @Output() productSelected = new EventEmitter();
    @Input() activeCategory: Category;
    @Input() excludeCategory: Category;
    @Input() showAll: boolean = false;
    @Input() compactView: boolean = false;
    products: Array<Product>;
    currency: string = appConfig.defaultCurrency;

    private connectSub;
    private productUpdatedSub;

    constructor(@Inject(forwardRef(() => ProductService)) private productService,
                @Inject(forwardRef(() => Utils)) private utils,
                @Inject(forwardRef(() => NetworkService)) private networkService,
                @Inject(forwardRef(() => AuthService)) private auth,
                private ref: ChangeDetectorRef) {

        // subscribe to connection becomes available to get latest products
        this.connectSub = this.networkService.connectSubscription.subscribe(() => {
            this.auth.authPromise.then(() => {
                this.getProducts();
            });
        });
    }

    getClasses(product: Product) {
        return {
            'col-xs-4 col-md-3': this.compactView,
            'col-xs-3 col-md-2': !this.compactView,
            '-hidden': product.hidden
        };
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
            this.filterProducts(products);
        });
    }

    filterProducts(products: Array<any>) {
        if (this.showAll) {
            this.products = products;
        } else {
            this.products = products.filter((product) => {
                if (this.activeCategory) {
                    return product.categoryId == this.activeCategory.uid
                        || (this.activeCategory.uid === null && product.categoryId === 0);
                }

                if (this.excludeCategory) {
                    return product.categoryId !== this.excludeCategory.uid
                }
            });
        }
        if (this.products.length === 0) {
            this.utils.showToast('This category doesn\'t has any products')
        }
    }

    /**
     * Get products from service when component init
     */
    ngOnInit(): void {
        this.getProducts();

        this.productUpdatedSub = this.productService.productUpdated.subscribe(products => {
            if (!products) return;

            this.filterProducts(products);

            this.ref.reattach();
            this.ref.detectChanges();
        })
    }

    /**
     * Remove listeners and unsubscribe from events
     */
    ngOnDestroy() {
        // remove subscription because component is no longer available
        this.connectSub.unsubscribe();
        this.productUpdatedSub.unsubscribe();
        document.removeEventListener('click', this.selectProduct.bind(null, null));
    }

}
