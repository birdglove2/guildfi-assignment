import { body } from 'express-validator';

export const verifyValidator = [
  body('signature').not().isEmpty().withMessage('signature must be provided'),
  body('walletAddress')
    .not()
    .isEmpty()
    // TODO: verify valid address
    .withMessage('walletAddress must be provided'),
];

export const loginValidator = [
  body('email').not().isEmpty().withMessage('Email must be provided'),
  body('password').not().isEmpty().withMessage('Password must be provided'),
];

export const signupValidator = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password')
    .trim()
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters'),
  body('confirmPassword').not().isEmpty().withMessage('Confirm Password must be provided'),
];
