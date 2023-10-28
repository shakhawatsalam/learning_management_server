/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import globalErrorHandler from '../../../utils/globalErrorHandler';
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import { IOrder } from './order.interface';
import userModel from '../user/user.model';
import CourseModel from '../course/course.model';
import { newOrder } from './order.service';
import path from 'path';
import ejs from 'ejs';
import sendMail from '../../../utils/sendMail';
import NotificationModal from '../notification/notification.modal';
// * create order
const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await userModel.findById(req.user?._id);

      const courseExistsInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId,
      );

      if (courseExistsInUser) {
        return next(
          new globalErrorHandler(
            'You have already purchased this course',
            httpStatus.NOT_FOUND,
          ),
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(
          new globalErrorHandler('Course not found', httpStatus.NOT_FOUND),
        );
      }

      const data: any = {
        courseId: course?._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course.id.slice(0, 6),
          name: course.name,
          price: course.price,
          data: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        },
      };
      const html = await ejs.renderFile(
        path.join(__dirname, '../../../mails/order-confirmation.ejs'),
        { order: mailData },
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: 'Order Confirmation',
            template: 'order-confirmation.ejs',
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(
          new globalErrorHandler(
            error.message,
            httpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }
      user?.courses.push(course.id);
      await user?.save();

      await NotificationModal.create({
        user: user?._id,
        title: 'New Order',
        message: `You have a new order form ${course?.name}`,
      });

      if (course) {
        course.purchased = (course.purchased || 0) + 1;
        await course.save();
      }
      newOrder(data, res, next);

      res.status(201).json({
        success: true,
        order: course,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * export's
export const OrderController = {
  createOrder,
};
