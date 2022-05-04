import { body } from 'express-validator';

export const loginValidator = [
  body('signature').not().isEmpty().withMessage('signature must be provided'),
  body('walletAddress')
    .not()
    .isEmpty()
    // TODO: verify valid address
    .withMessage('walletAddress must be provided'),
];
