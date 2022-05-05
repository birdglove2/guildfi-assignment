import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

/**
 * Middleware to check if use credentials are provided
 * if yes, move to the next middleware
 * if no, return 401
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentCredentials) {
    throw new NotAuthorizedError();
  }
  next();
};
