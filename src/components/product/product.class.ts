export class Product {

    constructor(public uid: string, public name: string, public description: string, public price: string,
                public bgColor: string, public txtColor: string, public categoryId: string, public created: string,
                public hidden?: boolean) {
        // all products are available on checkout page by default
    }
}