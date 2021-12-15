import { Router, Request, Response } from 'express';
import Product from '../models/Product';
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from '../middleware/VerifyToken';

const router = Router();

// Create
router.post('/', verifyTokenAndAdmin, async (req: Request, res: Response) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update
router.put('/:id', verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete
router.delete(
  '/:id',
  verifyTokenAndAdmin,
  async (req: Request, res: Response) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.status(200).json('Product has been deleted..');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// GET Product
router.get('/find/:id', async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET All Products
router.get('/', async (req: Request, res: Response) => {
  const queryNew = req.query.new;
  const queryCategory = req.query.category;
  try {
    let products;

    if (queryNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (queryCategory) {
      products = await Product.find({
        categories: {
          $in: [queryCategory as string],
        },
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
