import { Component } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';
import { Product } from "../../components/product";
import { PickColorPage } from "../";
import { ProductProvider } from "../../providers";
import { ProductService, Utils } from "../../services";
import { PickCategoryPage } from "../";
import { Category} from "../../components/category";
import { CategoryService } from "../../services/category.service";

@Component({
    selector: 'page-product-detail',
    templateUrl: 'product-detail.html'
})
export class ProductDetailPage {

    private activeProduct: Product;
    private selectedCategory: Category;

    constructor(private utils: Utils, private navParams: NavParams, private modalCtrl: ModalController,
                private productProvider: ProductProvider, private productService: ProductService,
                private categoryService: CategoryService) {

        const productFromParams = navParams.get('activeProduct');
        if (productFromParams) {
            this.selectedCategory = this.categoryService.getCategoryBy('id', productFromParams.categoryId);
        }
        this.activeProduct = productFromParams || ProductDetailPage.generateProduct();
    }

    static generateProduct() {
        return new Product(null, null, null, null, '#000', '#fff', null, null);
    }

    isProductValid() {
        if (!this.activeProduct.name) {
            this.utils.showToast('Product name missed');
            return false;
        }
        if (!this.activeProduct.categoryId) {
            this.utils.showToast('Please select category for product');
            return false;
        }
        if (!this.activeProduct.price) {
            this.utils.showToast('Please set price for product');
            return false;
        }
        return true;
    }

    pickColor(property) {
        let pickColorModal = this.modalCtrl.create(PickColorPage);
        pickColorModal.onDidDismiss(color => {
            if (color) this.activeProduct[property] = color;
        });
        pickColorModal.present();
    }

    saveProduct() {
        if (this.isProductValid()) {
            this.productProvider.saveProduct(this.activeProduct).subscribe((res) => {
                const response = res.json();
                if (response) {
                    this.utils.showToast('Product saved');
                    this.activeProduct = new Product(response.uid, response.name, response.description, response.price, response.background_color,
                        response.font_color, response.category_id, response.created_at);
                    this.productService.updateProducts(this.activeProduct);
                }
            });
        }
    }

    selectCategory() {
        let pickCategoryModal = this.modalCtrl.create(PickCategoryPage);
        pickCategoryModal.onDidDismiss((category: Category) => {
            if (!category) return;
            this.selectedCategory = category;
            this.activeProduct.categoryId = category.uid;
        });
        pickCategoryModal.present();

    }

}
