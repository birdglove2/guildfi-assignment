import express from 'express';
import { TransactionController } from './controller';
import { TransactionService } from './service/transaction';

const router = express.Router();

//TODO: add validator and validateRequest
router.get('/', TransactionService.listTransaction);

router.post('/', TransactionController.createTransaction);

export { router as TransactionRouter };
