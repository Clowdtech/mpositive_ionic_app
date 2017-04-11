import { Component, OnInit, OnDestroy, forwardRef, Inject, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CategoryService, NetworkService } from "../../services";
import { Category } from "./category.class";
import { CategoryDetailPage } from "../../pages";
import {AuthProvider} from "../../providers/auth.provider";

@Component({
  selector: 'category',
  templateUrl: 'category.html'
})
export class CategoryComponent implements OnInit, OnDestroy{

  @Output() productSelected = new EventEmitter();
  @Output() categorySelected = new EventEmitter();

  @Input() compactView: boolean = false;
  @Input() showTitle: boolean = false;
  @Input() enableDetails: boolean = false;
  @Input() hideProducts: boolean = false;

  categories: Array<Category>;
  activeCategory: Category;

  private connectSub;

  constructor(@Inject(forwardRef(() => CategoryService)) private categoryService,
      @Inject(forwardRef(() => NetworkService)) private networkService,
      @Inject(forwardRef(() => AuthProvider)) private auth,
      private navCtrl: NavController) {

    // get latest categories when connection is established
    this.connectSub = this.networkService.connectSubscription.subscribe(() => {
      this.auth.authPromise.then(() => {
        this.getCategories();
      });
    });
  }

  /**
   * Select category and make active from a list of categories
   * @param category
   */
  setActiveCategory(category) {
    this.activeCategory = category;
    this.categorySelected.emit(category);
  }

  /**
   * Get categories (cached in service; from server or cached in storage)
   */
  getCategories() {
    this.categoryService.getCategories().then(categories => {
      this.categories = categories;
    });
  }

  /**
   * Event which fires when product inside category is selected
   * @param product
   */
  productSelectedHandler(product) {
    this.productSelected.emit(product);
  }

  /**
   * Open edit page for certain category
   */
  editCategory() {
    this.navCtrl.push(CategoryDetailPage, {
      activeCategory: this.activeCategory
    });
  }

  ngOnInit(): void {
    this.getCategories();
  }

  ngOnDestroy() {
    // remove subscription because component is no longer available
    this.connectSub.unsubscribe();
  }
}
