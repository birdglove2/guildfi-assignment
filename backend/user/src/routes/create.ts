import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { validateRequest, NotFoundError, BadRequestError } from '../common';
import { body } from 'express-validator';
import { User } from '../models/user';
import { natsWrapper } from '../nats-wrapper';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { failResponse, successResponse } from '../common/utils';

const router = express.Router();

router.post(
  '/api/user',
  [
    body('address')
      .not()
      .isEmpty()
      // TODO: verify valid address
      // .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('address must be provided'),
    body('name').not().isEmpty().withMessage('name must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { address, name } = req.body;

    const user = await User.find({ address: address });
    if (user.length > 0) {
      failResponse(res, new BadRequestError('User already exists!'));
    }

    const newUser = User.build({
      address,
      name,
    });
    await newUser.save();
    new UserCreatedPublisher(natsWrapper.client).publish({
      id: newUser.id,
      address: newUser.address,
      name: newUser.name,
      version: newUser.version,
    });

    successResponse(res, 201, newUser);
  }
);

export { router as createUserRouter };
