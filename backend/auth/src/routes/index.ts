import express, { NextFunction, Request, Response } from 'express';
import { loginValidator } from './validator';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import {
  currentUser,
  successResponse,
  validateRequest,
  BadRequestError,
  failResponse,
} from '@gfassignment/common';

const router = express.Router();

router.get('/currentuser', currentUser, async (req: Request, res: Response) => {
  return successResponse(res, 200, req.currentUser);
});

router.post('/login', loginValidator, validateRequest, async (req: Request, res: Response) => {
  const { signature, walletAddress } = req.body;

  try {
    const message = 'helloBird';
    const decodedAddress = ethers.utils.verifyMessage(message, signature);

    if (decodedAddress.toUpperCase() !== walletAddress.toUpperCase()) {
      // to prevent different message return different wallet address
      return failResponse(res, new BadRequestError('Addresses are not matched!'));
    }

    const token = jwt.sign(
      {
        walletAddress,
      },
      process.env.JWT_KEY!,
      {
        expiresIn: '30d',
      }
    );

    res.status(200).json({ walletAddress, token });
  } catch (err) {
    console.log(err);
  }
});

export { router as AuthRouter };
