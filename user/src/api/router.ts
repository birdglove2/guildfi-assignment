import express from 'express';
import { validateRequest, currentCredentials, requireAuth } from '@gfassignment/common';
import { createUserValidator, connectWalletValidator } from './validator';
import { UserController } from './controller';

const router = express.Router();

router.get('/message', UserController.getMessageForSigning);

router.post(
  '/',
  currentCredentials,
  requireAuth,
  createUserValidator,
  validateRequest,
  UserController.createUser
);

// connect wallet
router.post(
  '/connectWallet',
  currentCredentials,
  requireAuth,
  connectWalletValidator,
  validateRequest,
  UserController.connectWallet
);

router.get('/:authId', UserController.getUserByAuthId);

router.get('/walletAddress/:walletAddress', UserController.getUserByWalletAddress);

// router.post('/transfer', async (req: Request, res: Response, next: NextFunction) => {
//   return UserService.transferGEM(req, res, next);
// });

export { router as UserRouter };
