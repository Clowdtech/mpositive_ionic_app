import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, forwardRef, Inject } from '@angular/core';
import { Product } from "./product.class";
import { Category } from "../category";
import { AuthProvider, ProductProvider } from "../../providers";
import { ProductService, Utils } from "../../services";
import { appConfig } from "../../app/config";

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

    constructor(@Inject(forwardRef(() => ProductService)) private productService, private utils: Utils,
        private productProvider: ProductProvider) {
    }

    selectProduct(product: Product) {
        this.productSelected.emit(product);
    }

    getProducts() {
        let products = this.productService.getProducts();
        if (!products) return null;
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
        return this.products;
    }

    ngOnInit(): void {
        if (!this.getProducts()) {
            this.productProvider.getProducts().subscribe(
                (data) => {
                    this.productService.setProducts(data.json());
                    this.getProducts();
                }
            );
        }
    }

    ngOnDestroy() {
        document.removeEventListener('click', this.selectProduct.bind(null, null));
    }

}
