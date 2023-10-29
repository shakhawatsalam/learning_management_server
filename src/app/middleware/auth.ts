import { Request, Response, NextFunction } from 'express';
import { CatchAsyncError } from './catchAsyncErrors';
import globalErrorHandler from '../../utils/globalErrorHandler';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { redis } from '../../redis';

// * authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
      return next(
        new globalErrorHandler(
          'User is Not Authenticated',
          httpStatus.UNAUTHORIZED,
        ),
      );
    }

    const decoded = jwt.verify(
      access_token,
      config.access_token as string,
    ) as JwtPayload;
    if (!decoded) {
      return next(new globalErrorHandler('access token is not valid', 400));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
      return next(
        new globalErrorHandler('user not found', httpStatus.BAD_REQUEST),
      );
    }
    req.user = JSON.parse(user);
    next();
  },
);

// validate user role
export const authorizeRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || '')) {
      return next(
        new globalErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this recourse`,
          httpStatus.FORBIDDEN,
        ),
      );
    } else {
      next();
    }
  };
};
