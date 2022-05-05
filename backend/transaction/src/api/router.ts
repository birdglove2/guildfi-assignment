import express from 'express';
import { TransactionController } from './controller';

const router = express.Router();

//TODO: add validator and validateRequest
router.post('/', TransactionController.createTransaction);

export { router as TransactionRouter };
