import { OrderItem } from "../../components/check-out-list";
import { PaymentType } from "./payment";

export class PaymentData {

    public payment_type_id: string;

    constructor(public orders: Array<{}>, public total: number, paymentType: PaymentType) {
        this.orders = orders.map((order: OrderItem) => {
            return { product_id: order.uid, price: order.price, qty: order.amount };
        });
        this.payment_type_id = paymentType.id;
    }
}
