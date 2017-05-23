import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProductService } from "../../services";
import { Product } from "../../components/product";
import { Category } from "../../components/category";
import { CategoryDetailPage } from "../";
import { ProductDetailPage } from "../";

@Component({
  selector: 'page-my-products',
  templateUrl: 'my-products.html'
})
export class MyProductsPage{

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

  constructor(private productService: ProductService, public navCtrl: NavController) {
    this.segment = 'category';
    this.setNavBtn(this.segment);
  }

  setNavBtn(btnKey) {
    this.navButton = this.buttons[btnKey];
  }

  openCreatePage() {
    this.navCtrl.push(this.navButton.page);
  }

  productSelected(product: Product) {
    this.navCtrl.push(ProductDetailPage, {
      activeProduct: product
    });
  }

  categorySelected(activeCategory) {
    this.activeCategory = activeCategory;
  }

  segmentChanged() {
    this.setNavBtn(this.segment);
  }



}
