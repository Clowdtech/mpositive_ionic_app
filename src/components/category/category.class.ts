
export class Category {

    uid: string;
    name: string;
    bgColor: string;
    txtColor: string;
    active: number;

    constructor(uid: string, name: string, bgColor: string, txtColor: string, active: number) {
        this.uid = uid;
        this.name = name;
        this.bgColor = bgColor;
        this.txtColor = txtColor;
        this.active = active;
    }

}