import express, { NextFunction, Request, Response } from 'express';
import { loginValidator } from './validator';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import {
  currentUser,
  successResponse,
  validateRequest,
  NotAuthorizedError,
} from '@gfassignment/common';
import { MESSAGE } from 'models/credential';

const router = express.Router();

router.get('/message', async (req: Request, res: Response) => {
  return successResponse(res, 200, { message: MESSAGE });
});

router.get('/currentuser', currentUser, async (req: Request, res: Response) => {
  return successResponse(res, 200, req.currentUser);
});

router.post(
  '/login',
  loginValidator,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { signature, walletAddress } = req.body;

    try {
      const decodedAddress = ethers.utils.verifyMessage(MESSAGE, signature);

      if (decodedAddress.toUpperCase() !== walletAddress.toUpperCase()) {
        // to prevent different message return different wallet address
        throw new NotAuthorizedError();
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

      return successResponse(res, 200, { walletAddress, token });
    } catch (err) {
      // should find a way to handle multiple case of error
      // for now it would return 500
      next(err);
    }
  }
);

export { router as AuthRouter };
