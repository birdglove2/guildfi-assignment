import { validateRequest } from '@gfassignment/common';
import express from 'express';
import { TransactionController } from './controller';
import { createTransactionValidator } from './validator';

const router = express.Router();

router.get('/', TransactionController.listTransaction);

router.post(
  '/',
  createTransactionValidator,
  validateRequest,
  TransactionController.createTransaction
);

export { router as TransactionRouter };
