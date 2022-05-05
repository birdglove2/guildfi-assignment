import { body } from 'express-validator';

export const createUserValidator = [
  body('signature').not().isEmpty().withMessage('Signature must be provided'),
  body('walletAddress')
    .not()
    .isEmpty()
    // TODO: verify valid address
    // .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Wallet Address must be provided'),
  body('name').not().isEmpty().withMessage('name must be provided'),
];
