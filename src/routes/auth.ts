import { Router, Request, Response } from 'express';
import User from '../models/User';
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken';

const router = Router();

// TODO: Register
router.post('/register', async (req: Request, res: Response) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      `${process.env.PASS_SEC}`
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// TODO: Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const user: any = await User.findOne({ username: req.body.username });
    !user && res.status(401).json('Wrong Credentials!');

    const hashedPassword = CryptoJS.AES.decrypt(
      `${user?.password}`,
      `${process.env.PASS_SEC}`
    );

    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    OriginalPassword !== req.body.password &&
      res.status(401).json('Wrong Credentials!');

    const accessToken = jwt.sign(
      {
        id: user?._id,
        isAdmin: user?.isAdmin,
      },
      `${process.env.JWT_SEC}`,
      { expiresIn: '3d' }
    );

    const { password, ...others } = user?._doc;

    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
