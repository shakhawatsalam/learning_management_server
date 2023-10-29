import { Document } from 'mongoose';

/* eslint-disable @typescript-eslint/consistent-type-definitions */
export interface IOrder extends Document {
  courseId: string;
  userId: string;
  payment_info: object;
}
