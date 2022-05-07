import { body } from 'express-validator';

export const createTransactionValidator = [
  body('hash').not().isEmpty().withMessage('Hash must be provided'),
];
