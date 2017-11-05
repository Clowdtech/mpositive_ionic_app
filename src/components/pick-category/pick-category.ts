import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Category } from "../../components/category";

@Component({
  selector: 'page-pick-category',
  templateUrl: 'pick-category.html'
})
export class PickCategoryPage {

  constructor(private viewCtrl: ViewController) {}

  categorySelected(category: Category) {
    this.viewCtrl.dismiss(category);
  }

}
