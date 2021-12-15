import { Router, Request, Response } from 'express';
import Stripe from 'stripe';
import router from './order';

const stripe: any = new Stripe(`${process.env.STRIPE_KEY}`, {
  apiVersion: '2020-08-27',
});

router.post('/payment', (req: Request, res: Response) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (stripeErr: any, stripeRes: any) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

export default router;
