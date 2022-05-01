import { Request, Response, NextFunction } from 'express';
import { InternalServerError } from '../errors/internal-server-error';
import { CustomError } from '../errors/custom-error';
import { failResponse } from '../utils';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof CustomError) {
    return failResponse(res, err);
  }

  //TODO: logs error
  const internalErr = new InternalServerError(err.message);
  failResponse(res, internalErr);
};
