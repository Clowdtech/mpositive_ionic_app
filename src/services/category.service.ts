import { Injectable, Inject, forwardRef } from '@angular/core';
import { Category } from "../components/category";
import { AuthService, NetworkService } from "./";
import { CategoryProvider } from "../providers";

@Injectable()
export class CategoryService {

    private categories: Array<Category>;
    private storagePath: string;
    private connectSub;
    private disconnectSub;

    constructor(@Inject(forwardRef(() => AuthService)) private auth: AuthService,
                @Inject(forwardRef(() => CategoryProvider)) private categoryProvider,
                @Inject(forwardRef(() => NetworkService)) private networkService) {

        this.storagePath = `mp_categories_`;

        // If authorized get latest products and subscribe to connection events
        if (this.auth.hasCredentials()) {
            this.subWhenConnected();
            this.subWhenDisconnected();
        }
    }

    public setCategories(categoryResponseArray) {
        this.categories = categoryResponseArray.map((category) => {
            if (category instanceof Category) return category;
            return new Category(category.uid, category.name, category.background_color, category.font_color, category.active);
        });

        this.saveCache();
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
        this.saveCache();
    }

    public getCategoryBy(propertyName: string, propertyValue: any) : Category {
        const matchedCategory = this.categories.find(category => {
            return category[propertyName] === propertyValue;
        });

        return matchedCategory;
    }

    public getCategories() : Promise<any> {
        return new Promise((resolve, reject) => {
            // return already existed products
            if (this.categories) {
                resolve(this.categories);
                return;
            }

            // if no available products get latest one or get from cache depends on connection
            if (navigator.onLine) {
                this.pullLatestCategories().then(categories => {
                    resolve(categories);
                }, res => {
                    reject(res);
                });
            } else {
                this.categories = this.getCache();
                resolve(this.categories);
            }
        });
    }

    pullLatestCategories() {
        return new Promise((resolve, reject) => {
            // wait while new token and uid are received
            this.auth.authPromise.then(() => {
                this.categoryProvider.getCategories().subscribe(
                    data => {
                        this.setCategories(data.json());
                        resolve(this.categories);
                    }, error => {
                        reject(error.json());
                    }
                );
            }, error => {
                reject(error);
            });
        });
    }

    public getCache() {
        let cache = window.localStorage.getItem(`${this.storagePath}${this.auth.getKey()}`);
        return cache && cache !== 'null' ? JSON.parse(cache) : [];
    }

    public saveCache() {
        if (!this.categories) return;
        window.localStorage.setItem(`${this.storagePath}${this.auth.getKey()}`, JSON.stringify(this.categories));
    }

    public logOut() {
        this.categories = null;
        this.connectSub.unsubscribe();
        this.disconnectSub.unsubscribe();
        delete this.connectSub;
        delete this.disconnectSub;
    }

    public logIn() {
        this.subWhenConnected();
        this.subWhenDisconnected();
    }

    private subWhenConnected() {
        if (this.connectSub) return;
        this.connectSub = this.networkService.connectSubscription.subscribe(() => {
            this.pullLatestCategories();
        });
    }

    private subWhenDisconnected() {
        if (this.disconnectSub) return;
        this.disconnectSub = this.networkService.disconnectSubscription.subscribe(() => {
            // save latest products to cache to use when offline
            this.saveCache();

            // logOut products because are out dated (product component still has latest products)
            //  this.categories = null;
        });
    }

}
