import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { validateRequest, NotFoundError, BadRequestError } from 'common';
import { body } from 'express-validator';
import { UserCreatedPublisher } from '/events/publishers/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/user',
  [
    body('address')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('address must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {}
);

export { router as createUserRouter };
