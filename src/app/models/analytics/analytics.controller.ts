/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from 'http-status';
import globalErrorHandler from '../../../utils/globalErrorHandler';
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import { generateLast12MonthData } from '../../../utils/analytics.generator';
import userModel from '../user/user.model';
import CourseModel from '../course/course.model';
import OrderModel from '../order/order.model';

// * get users analytics ----> only for admin
const getUserAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthData(userModel);
      res.status(200).json({
        success: true,
        message: 'User analytics fetched successfully',
        users,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
      );
    }
  },
);
// * get course analytics ----> only for admin
const getCourseAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthData(CourseModel);
      res.status(200).json({
        success: true,
        message: 'Course analytics fetched successfully',
        users,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
      );
    }
  },
);
// * get users analytics ----> only for admin
const getOrderAnalytics = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await generateLast12MonthData(OrderModel);
      res.status(200).json({
        success: true,
        message: 'Order analytics fetched successfully',
        users,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
      );
    }
  },
);

export const analyticsController = {
  getUserAnalytics,
  getCourseAnalytics,
  getOrderAnalytics,
};
