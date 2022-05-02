import { body } from 'express-validator';

export const createUserValidator = [
  body('address')
    .not()
    .isEmpty()
    // TODO: verify valid address
    // .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('address must be provided'),
  body('name').not().isEmpty().withMessage('name must be provided'),
];
