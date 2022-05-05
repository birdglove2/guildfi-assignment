import express, { NextFunction, Request, Response } from 'express';
import { validateRequest, currentCredentials } from '@gfassignment/common';
import { UserService } from './service/user';
import { createUserValidator } from './validator';
import { UserController } from './controller';

const router = express.Router();

router.post(
  '/',
  createUserValidator,
  currentCredentials,
  validateRequest,
  UserController.createUser
);

router.get('/:authId', UserController.getUserByAuthId);

router.get('/walletAddress/:walletAddress', UserController.getUserByWalletAddress);

router.post('/transfer', async (req: Request, res: Response, next: NextFunction) => {
  return UserService.transferGEM(req, res, next);
});

export { router as UserRouter };
