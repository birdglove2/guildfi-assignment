import { Response } from 'express';
import { CustomError } from '../errors/custom-error';

// Result Response for sending back api
interface IResponse {
  success: boolean; // is the response fail or success
  result: any; // either error, or any return object
}

/**
 *
 * @param res HTTP Response
 * @param statusCode  HTTP StatusCode
 * @param returnValue any object want to send back
 * @returns the json response indicates success request to the client
 */
export const successResponse = (res: Response, statusCode: number, returnValue: any) => {
  const response: IResponse = {
    success: true,
    result: returnValue,
  };
  return res.status(statusCode).json(response);
};

/**
 *
 * @param res HTTP Response
 * @param err CustomError
 * @returns the json response indicates fail request to the client
 */
export const failResponse = (res: Response, err: CustomError) => {
  const response: IResponse = {
    success: false,
    result: err.serializeErrors(),
  };
  return res.status(err.statusCode).json(response);
};
