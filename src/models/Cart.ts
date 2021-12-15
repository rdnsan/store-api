import { Types, Document, Schema, Model, model } from 'mongoose';

interface CartProduct {
  productId: string;
  quantity: number;
}

interface ICart extends Document {
  userId: string;
  products: Types.DocumentArray<CartProduct>;
}

const CartSchema: Schema = new Schema<ICart>(
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
  },
  { timestamps: true }
);

const Cart: Model<ICart> = model<ICart>('Cart', CartSchema);

export default Cart;
