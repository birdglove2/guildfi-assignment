import { validateRequest } from '@gfassignment/common';
import express from 'express';
import { TransactionController } from './controller';
import { TransactionService } from './service/transaction';
import { createTransactionValidator } from './validator';

const router = express.Router();

//TODO: add validator and validateRequest
router.get('/', TransactionController.listTransaction);

router.post(
  '/',
  createTransactionValidator,
  validateRequest,
  TransactionController.createTransaction
);

export { router as TransactionRouter };
