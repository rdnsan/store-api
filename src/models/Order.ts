import { Types, Document, Schema, Model, model } from 'mongoose';

interface CartProduct {
  productId: string;
  quantity: number;
}

interface IOrder extends Document {
  userId: string;
  products: Types.DocumentArray<CartProduct>;
  amount: number;
  address: object;
  status: string;
}

const OrderSchema: Schema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

const Order: Model<IOrder> = model<IOrder>('Order', OrderSchema);

export default Order;
