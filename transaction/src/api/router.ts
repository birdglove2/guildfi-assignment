import { validateRequest } from '@gfassignment/common';
import express from 'express';
import { TransactionController } from './controller';
import { createTransactionValidator } from './validator';

const router = express.Router();

router.get('/listUser', TransactionController.listUser);

router.get('/user', TransactionController.getTransactionByUserAuthId);

router.post(
  '/',
  createTransactionValidator,
  validateRequest,
  TransactionController.createTransaction
);

router.get('/', TransactionController.listTransaction);

export { router as TransactionRouter };
