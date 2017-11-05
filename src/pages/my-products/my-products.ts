import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Product } from "../../components/product";
import { Category } from "../../components/category";
import { CategoryDetailPage } from "../";
import { ProductDetailPage } from "../";

@Component({
  selector: 'page-my-products',
  templateUrl: 'my-products.html'
})
export class MyProductsPage{

  /**
   * Array of buttons for header right sections
   * @type {{product: {}; category: {}}
   */
  private buttons = {
    product: {
      name: 'Create Product',
      page: ProductDetailPage
    },
    category: {
      name: 'Create Category',
      page: CategoryDetailPage
    }
  };

  private navButton: {name: string, page: any};

  private segment: string;
  private activeCategory: Category;

  constructor(public navCtrl: NavController) {
    this.segment = 'category';
    this.setNavBtn(this.segment);
  }

  /**
   * Set button to be active in header
   * @param btnKey
   */
  setNavBtn(btnKey) {
    this.navButton = this.buttons[btnKey];
  }

  /**
   * Open page to create a new product/category
   */
  openCreatePage() {
    this.navCtrl.push(this.navButton.page);
  }

  /**
   * Fires when user selected product (used as Output inside Product component)
   * @param {Product} product
   */
  productSelected(product: Product) {
    this.navCtrl.push(ProductDetailPage, {
      activeProduct: product
    });
  }

  /**
   * Fires when user selected category (used as Output inside Category component)
   * @param {Category} activeCategory
   */
  categorySelected(activeCategory) {
    this.activeCategory = activeCategory;
  }

  /**
   * Change switcher for page segments
   */
  segmentChanged() {
    this.setNavBtn(this.segment);
  }



}
