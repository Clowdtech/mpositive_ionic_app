import { Component } from '@angular/core';
import { NavParams, ModalController, ToastController } from 'ionic-angular';
import { Category } from "../../components/category/category.class";
import { Product } from "../../components/product";
import { PickColorPage } from "../pick-color/pick-color";
import { CategoryProvider } from "../../providers";
import { CategoryService } from "../../services";

@Component({
  selector: 'page-product-detail',
  templateUrl: 'category-detail.html'
})
export class CategoryDetailPage {

  private activeCategory: Category;

  constructor(private toastCtrl: ToastController, private navParams: NavParams, private modalCtrl: ModalController,
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
    pickColorModal.onDidDismiss(data => {
      this.activeCategory[property] = data;
    });
    pickColorModal.present();
  }

  saveCategory() {
    let toastOpt = {
      message: '',
      duration: 3000,
      position: 'top'
    };
    if (!this.activeCategory.name) {
      toastOpt.message = 'Category name missed';
      this.toastCtrl.create(toastOpt).present();
      return;
    }
    this.categoryProvider.saveCategory(this.activeCategory).subscribe((res) => {
      const response = res.json();
      if (response) {
        toastOpt.message = 'Category saved';
        this.toastCtrl.create(toastOpt).present();
      }
      this.activeCategory = new Category(response.uid, response.name, response.background_color, response.font_color, response.active);
      this.categoryService.updateCategories(this.activeCategory);
    });
  }

}
