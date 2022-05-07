import { TransactionService } from './service/transaction';
import { NextFunction, Request, Response } from 'express';
import { successResponse } from '@gfassignment/common';
import { Pagination } from './service/pagination';
import { UserService } from './service/user';

export class TransactionController {
  public static async listUser(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.listUser();
      successResponse(res, 200, users);
    } catch (err) {
      next(err);
    }
  }

  public static async listTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;
      const { p, l } = Pagination.clean(page as string, limit as string);
      const result = await TransactionService.listTransaction(p, l);
      successResponse(res, 200, result);
    } catch (err) {
      next(err);
    }
  }

  public static async getTransactionByUserAuthId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userAuthId, page, limit } = req.query;
      const { p, l } = Pagination.clean(page as string, limit as string);
      const result = await TransactionService.getTransactionByUserAuthId(
        userAuthId as string,
        p,
        l
      );
      successResponse(res, 200, result);
    } catch (err) {
      next(err);
    }
  }
  public static async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await TransactionService.createTransaction(req.body.hash);
      successResponse(res, 201, result);
    } catch (err) {
      next(err);
    }
  }
}
