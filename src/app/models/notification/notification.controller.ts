/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import globalErrorHandler from '../../../utils/globalErrorHandler';
import httpStatus from 'http-status';
import NotificationModal from './notification.modal';

// * get all notification ----> only for admin
const getNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModal.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        success: true,
        notification,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * update notification status --- only admin
const updateNotification = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notification = await NotificationModal.findById(req.params.id);
      if (!notification) {
        return next(
          new globalErrorHandler(
            'Notification not found',
            httpStatus.NOT_FOUND,
          ),
        );
      } else {
        notification.status
          ? (notification.status = 'read')
          : notification?.status;
      }

      await notification.save();

      const notifications = await NotificationModal.find().sort({
        createdAt: -1,
      });

      res.status(201).json({
        sussess: true,
        notifications,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

export const notificationController = {
  getNotification,
  updateNotification,
};
