import { Router, Request, Response } from 'express';
import Cart from '../models/Cart';
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from '../middleware/VerifyToken';

const router = Router();

// Create
router.post('/', verifyToken, async (req: Request, res: Response) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update
router.put(
  '/:id',
  verifyTokenAndAuthorization,
  async (req: Request, res: Response) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// Delete
router.delete(
  '/:id',
  verifyTokenAndAuthorization,
  async (req: Request, res: Response) => {
    try {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json('Cart has been deleted..');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// GET User Cart
router.get(
  '/find/:userId',
  verifyTokenAndAuthorization,
  async (req: Request, res: Response) => {
    try {
      const cart = await Cart.findOne({ userId: req.params.userId });
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// GET All
router.get('/', verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
