import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoute from './routes/user';
import authRoute from './routes/auth';
import productRoute from './routes/product';
import cartRoute from './routes/cart';
import orderRoute from './routes/order';
import stripeRoute from './routes/stripe';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
const URI: string = `/api/v1`;

async function dbConnection(): Promise<void> {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log('Connected to MongoDB!');
  } catch (err) {
    console.log(err);
  }
}

dbConnection();

app.use(cors());
app.use(express.json());

app.use(`${URI}/auth`, authRoute);
app.use(`${URI}/users`, userRoute);
app.use(`${URI}/products`, productRoute);
app.use(`${URI}/carts`, cartRoute);
app.use(`${URI}/orders`, orderRoute);
app.use(`${URI}/checkout`, stripeRoute);

app.use((req, res, next) => {
  res.status(404).send('404 Not Found!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
