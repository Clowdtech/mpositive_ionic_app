import { Component } from '@angular/core';
import { NavParams, ModalController, ToastController } from 'ionic-angular';
import { Product } from "../../components/product";
import { PickColorPage } from "../";
import { ProductProvider } from "../../providers";
import { ProductService } from "../../services";
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

    constructor(private toastCtrl: ToastController, private navParams: NavParams, private modalCtrl: ModalController,
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
        // TODO refactor for single toat creating
        if (!this.activeProduct.name) {
            let toast = this.toastCtrl.create({
                message: 'Product name missed',
                duration: 3000
            });
            toast.present();
            return false;
        }
        if (!this.activeProduct.categoryId) {
            let toast = this.toastCtrl.create({
                message: 'Please select category for product',
                duration: 3000
            });
            toast.present();
            return false;
        }
        if (!this.activeProduct.price) {
            let toast = this.toastCtrl.create({
                message: 'Please set price for product',
                duration: 3000
            });
            toast.present();
            return false;
        }
        return true;
    }

    pickColor(property) {
        let pickColorModal = this.modalCtrl.create(PickColorPage);
        pickColorModal.onDidDismiss(data => {
            this.activeProduct[property] = data;
        });
        pickColorModal.present();
    }

    saveProduct() {
        if (this.isProductValid()) {
            this.productProvider.saveProduct(this.activeProduct).subscribe((res) => {
                const response = res.json();
                if (response) {
                    let toast = this.toastCtrl.create({
                        message: 'Product saved',
                        duration: 3000
                    });
                    toast.present();
                }
                this.activeProduct = new Product(response.uid, response.name, response.description, response.price, response.background_color,
                    response.font_color, response.category_id, response.created_at);
                this.productService.updateProducts(this.activeProduct);
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
