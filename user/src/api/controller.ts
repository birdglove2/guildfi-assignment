import { NextFunction, Request, Response } from 'express';
import { BadRequestError, successResponse } from '@gfassignment/common';
import { UserService } from './service/user';
import { MESSAGE, WalletAddress } from './service/walletAddress';

export class UserController {
  public static async getMessageForSigning(req: Request, res: Response, next: NextFunction) {
    return successResponse(res, 200, { message: MESSAGE });
  }

  public static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name } = req.body;

      const user = await UserService.createUser({
        authId: req.currentCredentials!.authId,
        email: req.currentCredentials!.email,
        name,
      });

      return successResponse(res, 201, user);
    } catch (err) {
      next(err);
    }
  }

  public static async connectWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { signature, walletAddress } = req.body;
      const isWalletOwner = await WalletAddress.verify(signature, walletAddress);
      if (!isWalletOwner) {
        throw new BadRequestError('Signature is not matched with wallet address provided');
      }

      const user = await UserService.updateUser({
        authId: req.currentCredentials!.authId,
        walletAddress,
      });

      successResponse(res, 200, user);
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
