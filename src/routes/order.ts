import { Router, Request, Response } from 'express';
import Order from '../models/Order';
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from '../middleware/VerifyToken';

const router = Router();

// Create
router.post('/', verifyToken, async (req: Request, res: Response) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update
router.put('/:id', verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
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
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json('Order has been deleted..');
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// GET User Orders
router.get(
  '/find/:userId',
  verifyTokenAndAuthorization,
  async (req: Request, res: Response) => {
    try {
      const orders = await Order.find({ userId: req.params.userId });
      res.status(200).json(orders);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// GET All
router.get('/', verifyTokenAndAdmin, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET Monthly Income
router.get(
  '/income',
  verifyTokenAndAdmin,
  async (req: Request, res: Response) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1)
    );

    try {
      const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        {
          $project: {
            month: { $month: '$createdAt' },
            sales: '$amount',
          },
        },
        {
          $group: {
            _id: { $sum: '$month' },
            total: { $sum: '$sales' },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

export default router;
