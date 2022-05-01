import express, { Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError } from '../common';
import { User } from '../models/user';
import { failResponse, successResponse } from '../common/utils';
import { getBalance } from '../contract';

const router = express.Router();

router.get('/api/user/:address', async (req: Request, res: Response) => {
  const { address } = req.params;

  const users = await User.find({ address: address });

  if (!users || users.length === 0) {
    return failResponse(res, new NotFoundError('User'));
  }

  //TODO: too slow need caching
  const balance = await getBalance(address);

  const result = { ...users[0].toJSON(), balance };
  successResponse(res, 200, result);
});

export { router as showUserRouter };
