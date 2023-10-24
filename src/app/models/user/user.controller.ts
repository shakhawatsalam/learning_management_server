/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import globalErrorHandler from '../../../utils/globalErrorHandler';
import userModel from './user.model';
import httpStatus from 'http-status';
import { IRegistrationBody } from './user.interface';
import { jwtHeapers } from '../../../helpers/activationTokenHelpers';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../../../utils/sendMail';

const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(
          new globalErrorHandler('Email already exist', httpStatus.BAD_REQUEST),
        );
      }
      const user: IRegistrationBody = {
        name: name,
        email: email,
        password: password,
      };
      const activationToken = jwtHeapers.createActivationToken(user);
      const activationCode = activationToken.activationCode;
      const data = { user: { name: user.name }, activationCode };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const html = await ejs.renderFile(
        path.join(__dirname, '../../../mails/activation-mail.ejs'),
        data,
      );

      try {
        await sendMail({
          email: user.email,
          subject: 'Activate your account',
          template: 'activation-mail.ejs',
          data,
        });
        res.status(201).json({
          success: true,
          message: 'Please Check your Email to Activate your account',
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(
          new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
        );
      }
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
      );
    }
  },
);

export const userController = {
  registrationUser,
};
