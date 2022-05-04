import express, { NextFunction, Request, Response } from 'express';
import {
  BadRequestError,
  failResponse,
  NotFoundError,
  successResponse,
  validateRequest,
  currentUser,
} from '@gfassignment/common';
import { UserService } from './service';
import { createUserValidator } from './validator';

const router = express.Router();

router.post(
  '/',
  createUserValidator,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await UserService.createUser(req.body);
      return successResponse(res, 201, user);
    } catch (err) {
      next(err);
    }
  }
);

router.get('/:address', currentUser, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.currentUser) {
      const user = await UserService.showUserWithPrivateData(req.currentUser.walletAddress);
      return successResponse(res, 200, user);
    }

    const { address } = req.params;
    if (!address) {
      throw new BadRequestError('No address provided!');
    }

    const user = await UserService.showUser(address);
    if (!user) {
      throw new NotFoundError('User');
    }
    return successResponse(res, 200, user);
  } catch (err) {
    next(err);
  }
});

router.post('/transfer', async (req: Request, res: Response, next: NextFunction) => {
  return UserService.transferGEM(req, res, next);
});

export { router as UserRouter };
