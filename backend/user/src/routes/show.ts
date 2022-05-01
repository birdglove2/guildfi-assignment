import express, { Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError } from 'common';

const router = express.Router();

router.get('/api/user/:address', async (req: Request, res: Response) => {});

export { router as showUserRouter };
