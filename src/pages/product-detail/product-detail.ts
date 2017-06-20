import { Component } from '@angular/core';
import { NavParams, ModalController, NavController } from 'ionic-angular';
import { Product } from "../../components/product";
import { PickColorPage } from "../";
import { ProductProvider } from "../../providers";
import { ProductService, Utils } from "../../services";
import { PickCategoryPage, UpdatedPage } from "../";
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
                private categoryService: CategoryService, private nav: NavController) {

        const productFromParams = navParams.get('activeProduct');
        if (productFromParams) {
            this.selectedCategory = this.categoryService.getCategoryBy('id', productFromParams.categoryId);
        }
        this.activeProduct = productFromParams || ProductDetailPage.generateProduct();
    }

    static generateProduct() {
        return new Product(null, null, null, null, '#000', '#fff', null, null);
    }

    pickColor(property) {
        let pickColorModal = this.modalCtrl.create(PickColorPage);
        pickColorModal.onDidDismiss(color => {
            if (color) this.activeProduct[property] = color;
        });
        pickColorModal.present();
    }

    saveProduct() {
        this.productProvider.saveProduct(this.activeProduct).subscribe((res) => {
            const response = res.json();
            if (response) {
                this.success(response);
            }
        }, res => {
            this.utils.showToast(res.json().error);
        });
    }

    success(response) {
        this.utils.showToast('Product saved');
        const updatedProduct = new Product(response.uid, response.name, response.description, response.price, response.background_color,
            response.font_color, response.category_id, response.created_at);

        this.productService.updateProducts(updatedProduct);
        this.nav.push(UpdatedPage, {
            type: 'product'
        }).then(() => {
            this.activeProduct = ProductDetailPage.generateProduct();
        });
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
