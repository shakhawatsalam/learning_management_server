/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import globalErrorHandler from '../../utils/globalErrorHandler';

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // * wrong mongoDb id error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new globalErrorHandler(message, 400);
  }

  // * Duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} endred`;
    err = new globalErrorHandler(message, 400);
  }

  // * Wrong jwt error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json Web token is invalid, try again`;
    err = new globalErrorHandler(message, 400);
  }

  // * Jwt Expire error
  if (err.name === 'TokenExpiredError') {
    const message = `Json web toke is expired, tye again`;
    err = new globalErrorHandler(message, 400);
  }

  res.status(res.statusCode).json({
    success: false,
    message: err.message,
  });
};
