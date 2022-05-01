import { ethers } from 'ethers';
import express, { Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError } from '../common';
import { User } from '../models/user';
import { failResponse, successResponse } from '../common/utils';
import { getBalance, getContractInstance, transfer } from '../contract';

const router = express.Router();

const toAccount = '0x7fDBf34B6a59b9E0baF98032f53b8a8eBC1ba65F';

//WARNING: how to get privateKey ??
router.post('/api/user/transfer', async (req: Request, res: Response) => {
  const { privateKey, to } = req.body;
  const amount = ethers.utils.parseEther('20000');
  const tx = await transfer(privateKey, to, amount);
  successResponse(res, 200, tx);
});

export { router as showUserRouter };
