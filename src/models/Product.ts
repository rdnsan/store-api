import { Document, Schema, Model, model } from 'mongoose';

interface IProduct extends Document {
  title: string;
  description: string;
  image: string;
  categories: string[];
  size: string;
  color: string;
  price: number;
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    categories: { type: [String] },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = model<IProduct>('Product', ProductSchema);

export default Product;
