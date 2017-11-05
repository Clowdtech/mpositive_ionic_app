import { Component, ChangeDetectorRef } from '@angular/core';
import { NavParams, ModalController, NavController } from 'ionic-angular';
import { Category } from "../../components/category/category.class";
import { Product } from "../../components/product";
import { UpdatedPage } from "../";
import { PickColorPage } from "../../components/pick-color/pick-color";
import { CategoryProvider } from "../../providers";
import { CategoryService, Utils } from "../../services";
import {PickProductPage} from "../../components/pick-product/pick-product";
import {ProductProvider} from "../../providers/product.provider";
import {ProductService} from "../../services/product.service";

@Component({
  selector: 'page-product-detail',
  templateUrl: 'category-detail.html'
})
export class CategoryDetailPage {

  private activeCategory: Category;

  constructor(private utils: Utils, private navParams: NavParams, private modalCtrl: ModalController,
    private categoryProvider: CategoryProvider, private categoryService: CategoryService, private nav: NavController,
    private ref: ChangeDetectorRef, private productProvider: ProductProvider, private productService: ProductService) {

    this.activeCategory = navParams.get('activeCategory') || CategoryDetailPage.generateNewCategory();
  }

  /**
   * Handler to catch products selection inside category page
   * @param product
   */
  productSelected(product: Product) {

  }

  addProducts() {
      let pickProductModal = this.modalCtrl.create(PickProductPage, { excludedCategory: this.activeCategory });

      pickProductModal.onDidDismiss((product: Product) => {
          if (!product) return;

          product.categoryId = this.activeCategory.uid;
          this.productProvider.saveProduct(product).subscribe(response => {
              response = response.json();
              const updatedProduct = new Product(response.uid, response.name, response.description, response.price, response.background_color,
                  response.font_color, response.category_id, response.created_at);

              this.productService.updateProducts(updatedProduct);
          }, error => {
              this.utils.showToast(error)
          });

      });
      pickProductModal.present();
  }

  /**
   * Create placeholder for new category
   * @return {Category}
   */
  static generateNewCategory() {
    return new Category(null, null, '#000', '#fff', 1);
  }

  /**
   * Change active property for category
   */
  changeActive() {
    this.activeCategory.active ? this.activeCategory.active = 0 : this.activeCategory.active = 1;
  }

  /**
   * Color picker popUp functionality
   * @param property
   */
  pickColor(property) {
    let pickColorModal = this.modalCtrl.create(PickColorPage);
    pickColorModal.onDidDismiss(color => {
      if (color) this.activeCategory[property] = color;
    });
    pickColorModal.present();
  }

  /**
   * Make request to save new category
   */
  saveCategory() {
    if (!this.activeCategory.name) {
      this.utils.showToast('Category name missed');
      return;
    }
    this.categoryProvider.saveCategory(this.activeCategory).subscribe((res) => {
      const response = res.json();
      if (response) {
        this.success(response);
      }
    });
  }

  /**
   * Success handler to save category
   * @param response
   */
  success(response) {
    const savedCategory = new Category(response.uid, response.name, response.background_color, response.font_color, response.active);
    this.categoryService.updateCategories(savedCategory);
    this.nav.push(UpdatedPage, {
      type: 'category'
    }).then(() => {
      this.activeCategory = CategoryDetailPage.generateNewCategory();
      // update layout with changes
      this.ref.reattach();
      this.ref.detectChanges();
    });
  }

}
