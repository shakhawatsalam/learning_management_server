/* eslint-disable @typescript-eslint/no-explicit-any */
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import OrderModel from './order.model';

// * create new order
export const newOrder = CatchAsyncError(async (data: any) => {
  const order = await OrderModel.create(data);
  return order;
});
