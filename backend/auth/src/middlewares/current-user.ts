import { Request, Response, NextFunction } from 'express';
import { failResponse } from '../common';
import { NotAuthorizedError } from '../common';
import jwt from 'jsonwebtoken';

interface UserPayload {
  walletAddress: string;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return failResponse(res, new NotAuthorizedError());
  }

  const token = authorization.substring(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
    next();
  } catch (err) {
    return failResponse(res, new NotAuthorizedError());
  }
};
