/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import globalErrorHandler from '../../../utils/globalErrorHandler';
import userModel from './user.model';
import httpStatus from 'http-status';
import {
  IActivationRequest,
  ILoginRequest,
  IRegistrationBody,
  IUser,
} from './user.interface';
import { jwtHeapers } from '../../../helpers/activationTokenHelpers';
import ejs from 'ejs';
import path from 'path';
import sendMail from '../../../utils/sendMail';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import { sendToke } from '../../../utils/jwt';
import { redis } from '../../../redis';

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
//? 2:34:22

// * activate user
const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_code, activation_token } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        config.jwt_secret as string,
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(
          new globalErrorHandler(
            'Invalid Activation Code',
            httpStatus.BAD_REQUEST,
          ),
        );
      }
      const { name, email, password } = newUser.user;
      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(
          new globalErrorHandler('Email Already Exist', httpStatus.BAD_REQUEST),
        );
      }
      const user = await userModel.create({
        name,
        email,
        password,
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
      );
    }
  },
);

// * Login User
const logInUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(
          new globalErrorHandler(
            'Please Enter Email And Password',
            httpStatus.BAD_REQUEST,
          ),
        );
      }
      const user = await userModel.findOne({ email }).select('+password');
      if (!user) {
        return next(
          new globalErrorHandler(
            'Invalid Email Or Password',
            httpStatus.BAD_REQUEST,
          ),
        );
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(
          new globalErrorHandler(
            'Invalid email or password',
            httpStatus.BAD_REQUEST,
          ),
        );
      }
      sendToke(user, 200, res);
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
      );
    }
  },
);

// * logout user
const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie('access_token', '', { maxAge: 1 });
      res.cookie('refresh_token', '', { maxAge: 1 });
      const userId = req.user?._id || '';

      redis.del(userId);
      res.status(200).json({
        success: true,
        message: 'Logged Out successfully',
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
      );
    }
  },
);

export const userController = {
  registrationUser,
  activateUser,
  logInUser,
  logoutUser,
};
