import { NextFunction, Request, Response } from 'express';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  successResponse,
} from '@gfassignment/common';
import { UserService } from './service/user';
import { WalletAddress } from './service/walletAddress';

export class UserController {
  public static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.currentCredentials) {
        throw new NotAuthorizedError();
      }

      const { signature, walletAddress, name } = req.body;
      const isWalletOwner = await WalletAddress.verify(signature, walletAddress);
      if (!isWalletOwner) {
        throw new BadRequestError('Signature is not matched with wallet address provided');
      }

      const user = await UserService.createUser({
        authId: req.currentCredentials.authId,
        email: req.currentCredentials.email,
        walletAddress,
        name,
      });

      return successResponse(res, 201, user);
    } catch (err) {
      next(err);
    }
  }

  public static async getUserByAuthId(req: Request, res: Response, next: NextFunction) {
    try {
      const { authId } = req.params;
      const user = await UserService.findByField('authId', authId);
      successResponse(res, 200, user);
    } catch (err) {
      next(err);
    }
  }

  public static async getUserByWalletAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const { walletAddress } = req.params;
      const user = await UserService.findByField('walletAddress', walletAddress);
      return successResponse(res, 200, user);
    } catch (err) {
      next(err);
    }
  }
}
