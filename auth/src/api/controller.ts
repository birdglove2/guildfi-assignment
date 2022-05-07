import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { successResponse, BadRequestError } from '@gfassignment/common';
import { AuthService } from './service/auth';

export class AuthController {
  public static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        throw new BadRequestError('Password and confirm password are not matched');
      }

      const newUser = await AuthService.createCredentials({ email, password });

      // Generate JWT token
      const token = jwt.sign(
        {
          authId: newUser.id,
          email: newUser.email,
        },
        process.env.JWT_KEY!
      );

      successResponse(res, 201, { user: newUser, token });
    } catch (err) {
      next(err);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const user = await AuthService.findByCredentials({ email, password });

      // Generate JWT token
      const token = jwt.sign(
        {
          authId: user.id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );

      successResponse(res, 200, { user, token });
    } catch (err) {
      next(err);
    }
  }
}
