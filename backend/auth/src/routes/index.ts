import express, { NextFunction, Request, Response } from 'express';
import { loginValidator, signupValidator } from './validator';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import {
  currentUser,
  successResponse,
  validateRequest,
  BadRequestError,
  NotAuthorizedError,
} from '@gfassignment/common';
import { MESSAGE } from 'models/credential.old';
import { AuthService } from './service/auth';

const router = express.Router();

router.post('/signup', signupValidator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new BadRequestError('Password and confirm password are not matched');
    }

    const newUser = await AuthService.createCredentials({ email, password });

    // Generate JWT token
    const token = jwt.sign(
      {
        authId: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    );

    successResponse(res, 201, { user: newUser, token });
  } catch (err) {
    next(err);
  }
});

router.post('/login', loginValidator, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await AuthService.findByCredentials({ email, password });

    // Generate JWT token
    const token = jwt.sign(
      {
        authId: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );

    successResponse(res, 200, { user, token });
  } catch (err) {
    next(err);
  }
});

router.get('/message', async (req: Request, res: Response) => {
  return successResponse(res, 200, { message: MESSAGE });
});

router.get('/currentuser', currentUser, async (req: Request, res: Response) => {
  return successResponse(res, 200, req.currentUser);
});

router.post(
  '/verify',
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
