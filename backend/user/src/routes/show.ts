import express, { Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError } from '../common';
import { User } from '../models/user';
import { failResponse, successResponse } from '../common/utils';

const router = express.Router();

router.get('/api/user/:address', async (req: Request, res: Response) => {
  const { address } = req.params;

  const user = await User.find({ address: address });
  if (!user || user.length === 0) {
    failResponse(res, new NotFoundError('User'));
  }

  // TODO: query GEM balance
  successResponse(res, 200, user[0]);
});

export { router as showUserRouter };
