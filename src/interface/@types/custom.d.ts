/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { Request } from 'express';
import IUser from '../../app/models/user/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
