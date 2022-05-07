import { Request, Response, NextFunction } from 'express';
import { InternalServerError } from '../errors/internal-server-error';
import { CustomError } from '../errors/custom-error';
import { failResponse } from '../utils/response';
import { logger } from '../utils/logger';

/**
 * ErrorHandler middleware catch every error thrown by application
 * if it does not match any CustomError
 * then it is internal error indicating that developers missing some error checks
 * or there is a bug inside the application
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return failResponse(res, err);
  }

  logger.error(err.message);
  const internalErr = new InternalServerError(err.message);
  return failResponse(res, internalErr);
};
