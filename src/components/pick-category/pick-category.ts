import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
import { Category } from "../../components/category";
import { Product } from "../product/product.class";

@Component({
  selector: 'page-pick-category',
  templateUrl: 'pick-category.html'
})
export class PickCategoryPage {

  private activeProduct: Product;
  private selectedCategory: Category;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private alertCtrl: AlertController) {
      this.activeProduct = navParams.get('activeProduct')
      this.selectedCategory = navParams.get('selectedCategory')
  }

  categorySelected(category: Category) {
    if (!!this.activeProduct.categoryId && this.activeProduct.categoryId !== category.uid) {
        const alert = this.alertCtrl.create({
            title: 'Confirm',
            message: `This product is from category ${this.selectedCategory.name}. Do you want to change it?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Change',
                    handler: () => {
                        this.viewCtrl.dismiss(category);
                    }
                }
            ]
        });

        alert.present();
    } else {
      this.viewCtrl.dismiss(category);
    }
  }

}
