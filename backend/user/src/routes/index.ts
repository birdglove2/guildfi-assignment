import express, { Request, Response } from 'express';
import { validateRequest } from '../common';
import { UserService } from './service';
import { createUserValidator } from './validator';
const router = express.Router();

router.post('/', createUserValidator, validateRequest, async (req: Request, res: Response) => {
  return UserService.createUser(req, res);
});

router.get('/:address', async (req: Request, res: Response) => {
  return UserService.showUser(req, res);
});

router.post('/transfer', async (req: Request, res: Response) => {
  return UserService.transferGEM(req, res);
});

export { router as UserRouter };
