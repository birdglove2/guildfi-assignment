import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  authId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      currentCredentials?: AuthPayload;
    }
  }
}

export const currentCredentials = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next();
  }

  const token = authorization.substring(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as AuthPayload;
    req.currentCredentials = payload;
    next();
  } catch (err) {
    return next();
  }
};
