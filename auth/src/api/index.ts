import express, { NextFunction, Request, Response } from 'express';
import { loginValidator, signupValidator } from './validator';
import { ethers } from 'ethers';
import jwt from 'jsonwebtoken';
import {
  currentCredentials,
  successResponse,
  validateRequest,
  NotAuthorizedError,
} from '@gfassignment/common';
import { AuthController } from './controller';

const router = express.Router();

router.post('/signup', signupValidator, validateRequest, AuthController.signup);

router.post('/login', loginValidator, validateRequest, AuthController.login);

router.get('/currentuser', currentCredentials, async (req: Request, res: Response) => {
  return successResponse(res, 200, req.currentCredentials);
});

// router.post(
//   '/verify',
//   loginValidator,
//   validateRequest,
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { signature, walletAddress } = req.body;
//     const MESSAGE = "Hello from backend"
//     try {
//       const decodedAddress = ethers.utils.verifyMessage(MESSAGE, signature);

//       if (decodedAddress.toUpperCase() !== walletAddress.toUpperCase()) {
//         // to prevent different message return different wallet address
//         throw new NotAuthorizedError();
//       }

//       const token = jwt.sign(
//         {
//           walletAddress,
//         },
//         process.env.JWT_KEY!,
//         {
//           expiresIn: '30d',
//         }
//       );

//       return successResponse(res, 200, { walletAddress, token });
//     } catch (err) {
//       // should find a way to handle multiple case of error
//       // for now it would return 500
//       next(err);
//     }
//   }
// );

export { router as AuthRouter };
