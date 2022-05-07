import express from 'express';
import { loginValidator, signupValidator } from './validator';
import { validateRequest } from '@gfassignment/common';
import { AuthController } from './controller';

const router = express.Router();

router.post('/signup', signupValidator, validateRequest, AuthController.signup);

router.post('/login', loginValidator, validateRequest, AuthController.login);

export { router as AuthRouter };
