import { Component } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';
import { Category } from "../../components/category/category.class";
import { Product } from "../../components/product";
import { PickColorPage } from "../pick-color/pick-color";
import { CategoryProvider } from "../../providers";
import { CategoryService, Utils } from "../../services";

@Component({
  selector: 'page-product-detail',
  templateUrl: 'category-detail.html'
})
export class CategoryDetailPage {

  private activeCategory: Category;

  constructor(private utils: Utils, private navParams: NavParams, private modalCtrl: ModalController,
      private categoryProvider: CategoryProvider, private categoryService: CategoryService) {
    this.activeCategory = navParams.get('activeCategory') || CategoryDetailPage.generateNewCategory();
  }

  productSelected(product: Product) {

  }

  static generateNewCategory() {
    return new Category(null, null, '#000', '#fff', 1);
  }

  changeActive() {
    this.activeCategory.active ? this.activeCategory.active = 0 : this.activeCategory.active = 1;
  }

  pickColor(property) {
    let pickColorModal = this.modalCtrl.create(PickColorPage);
    pickColorModal.onDidDismiss(color => {
      if (color) this.activeCategory[property] = color;
    });
    pickColorModal.present();
  }

  saveCategory() {
    if (!this.activeCategory.name) {
      this.utils.showToast('Category name missed');
      return;
    }
    this.categoryProvider.saveCategory(this.activeCategory).subscribe((res) => {
      const response = res.json();
      if (response) {
        this.utils.showToast('Category saved');
      }
      this.activeCategory = new Category(response.uid, response.name, response.background_color, response.font_color, response.active);
      this.categoryService.updateCategories(this.activeCategory);
    });
  }

}
