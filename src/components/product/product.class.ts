export class Product {

    uid: string;
    name: string;
    description: string;
    price: string;
    bgColor: string;
    txtColor: string;
    categoryId: string;
    created: string;

    constructor(uid: string, name: string, description: string,
                price: string, bgColor: string, txtColor: string, categoryId: string, created: string) {
        this.uid = uid;
        this.name = name;
        this.description = description;
        this.price = price;
        this.bgColor = bgColor;
        this.txtColor = txtColor;
        this.categoryId = categoryId;
        this.created = created;

    }
}