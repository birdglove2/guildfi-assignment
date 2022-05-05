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

/**
 * Middleware to attach credentials to the req. for using in next step as authentication process
 * Not throwing here for some case e.g. users need to view other user info
 * if user credentials matched with the looking person, then show some private data
 * if not, show public data
 */
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
