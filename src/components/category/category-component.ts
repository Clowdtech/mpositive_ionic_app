import { Component, OnInit, forwardRef, Inject, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CategoryService } from "../../services";
import { Category } from "./category.class";
import { CategoryProvider } from "../../providers";
import { AuthProvider } from "../../providers";
import { CategoryDetailPage } from "../../pages";

@Component({
  selector: 'category',
  templateUrl: 'category.html'
})
export class CategoryComponent implements OnInit{

  @Output() productSelected = new EventEmitter();
  @Output() categorySelected = new EventEmitter();

  @Input() compactView: boolean = false;
  @Input() showTitle: boolean = false;
  @Input() enableDetails: boolean = false;
  @Input() hideProducts: boolean = false;

  categories: Array<Category>;
  activeCategory: Category;

  constructor(@Inject(forwardRef(() => CategoryService)) private categoryService,
              private categoryProvider: CategoryProvider, private navCtrl: NavController) {
  }

  setActiveCategory(category) {
    this.activeCategory = category;
    this.categorySelected.emit(category);
  }

  getCategories() {
    return this.categories = this.categoryService.getCategories();
  }

  productSelectedHandler(product) {
    this.productSelected.emit(product);
  }

  editCategory() {
    this.navCtrl.push(CategoryDetailPage, {
      activeCategory: this.activeCategory
    });
  }

  ngOnInit(): void {
    if (!this.getCategories()) {
      this.categoryProvider.getCategories().subscribe(
          (data) => {
            this.categoryService.setCategories(data.json());
            this.getCategories();
          }
      );
    }
  }
}
