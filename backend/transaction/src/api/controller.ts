import { TransactionService } from './service/transaction';
import { NextFunction, Request, Response } from 'express';

export class TransactionController {
  public static async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      return TransactionService.createTransaction(req, res);
    } catch (err) {
      next(err);
    }
  }
}
