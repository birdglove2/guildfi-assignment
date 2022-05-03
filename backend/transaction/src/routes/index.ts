import { BadRequestError, failResponse } from '../common';
import express, { NextFunction, Request, Response } from 'express';
import { TransactionService } from './service';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  return TransactionService.createTransaction(req, res);
});

export { router as TransactionRouter };
