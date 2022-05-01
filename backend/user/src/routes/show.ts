import express, { Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError } from '../common';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/user/:address', async (req: Request, res: Response) => {
  const { address } = req.params;

  const user = await User.find({ address: address });
  if (!user) {
    throw new NotFoundError();
  }

  // TODO: query GEM balance

  res.status(200).json({ success: true, result: user });
});

export { router as showUserRouter };
