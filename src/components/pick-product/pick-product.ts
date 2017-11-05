import { Component } from '@angular/core';
import { ViewController, NavParams, AlertController } from 'ionic-angular';
import { Product } from "../../components/product";
import { Category } from "../category/category.class";
import {CategoryService} from "../../services/category.service";

@Component({
  selector: 'page-pick-product',
  templateUrl: 'pick-product.html'
})
export class PickProductPage {

  private excludedCategory: Category;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private alertCtrl: AlertController,
              private categoryService: CategoryService) {
      this.excludedCategory = navParams.get('excludedCategory')
  }

  productSelected(product: Product) {
    if (!!product.categoryId) {
      // confirm from user to move from one category to another
      this.categoryService.getCategories().then(categories => {
        const usedCategory = categories.find(category => {
          return category.uid == product.categoryId;
        });

        const alert = this.alertCtrl.create({
            title: 'Confirm',
            message: `This product is from existed category ${usedCategory.name}. Do you want to move it?`,
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Move',
                    handler: () => {
                        this.viewCtrl.dismiss(product);
                    }
                }
            ]
        });

        alert.present();
      });

    } else {
      this.viewCtrl.dismiss(product);
    }
  }

}
