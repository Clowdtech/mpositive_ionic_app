import { Injectable } from '@angular/core';
import { Category } from "../components/category";

@Injectable()
export class CategoryService {

    private categories: Array<Category>;

    constructor() {

    }

    public setCategories(categoryResponseArray) {
        this.categories = categoryResponseArray.map((category) => {
            if (category instanceof Category) return category;
            return new Category(category.uid, category.name, category.background_color, category.font_color, category.active);
        });
    }

    public updateCategories(category: Category) {
        const ind =  this.categories.findIndex((cat) => {
            return cat.uid === category.uid && cat.name === category.name;
        });
        if (ind === -1){
            this.categories.push(category);
        } else{
            this.categories[ind] = category;
        }
    }

    public getCategoryBy(propertyName: string, propertyValue: any) : Category {
        return this.categories.find(() => {
            return this.categories[propertyName] = propertyValue;
        })
    }

    public getCategories() : Array<Category> {
        return this.categories;
    }

    public clear() {
        this.categories = null;
    }

}
