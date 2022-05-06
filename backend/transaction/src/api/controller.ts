import { TransactionService } from './service/transaction';
import { NextFunction, Request, Response } from 'express';
import { successResponse } from '@gfassignment/common';
import { TransactionRecord } from 'models/transactionRecord';
import { TransactionRecordService } from './service/transactionRecord';
import { Pagination } from './service/pagination';

export class TransactionController {
  public static async listTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('req.pa', req.query);
      const { userAuthId, walletAddress, page, limit } = req.query;
      // console.log('ssss', userAuthId);
      const { p, l } = Pagination.clean(page as string, limit as string);
      const result = await TransactionService.listTransaction(userAuthId as string, p, l);
      successResponse(res, 200, result);
      // successResponse(res, 200, 's');
    } catch (err) {
      next(err);
    }
  }
  public static async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      // console.log('here1');
      const x = await TransactionService.createTransaction(req.body.hash);
      // console.log('here3', x);
      successResponse(res, 201, x);
    } catch (err) {
      next(err);
    }
  }
}
