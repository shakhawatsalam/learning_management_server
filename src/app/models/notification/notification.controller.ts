/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import globalErrorHandler from '../../../utils/globalErrorHandler';
import httpStatus from 'http-status';
import NotificationModal from './notification.modal';
import cron from 'node-cron';

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

// * Delete Notification --- only admin
cron.schedule('0 0 0 * * *', async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  await NotificationModal.deleteMany({
    status: 'read',
    createdAt: { $lt: thirtyDaysAgo },
  });
  console.log('Deleted Read Notification');
});

export const notificationController = {
  getNotification,
  updateNotification,
};
