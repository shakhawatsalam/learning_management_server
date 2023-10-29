/* eslint-disable @typescript-eslint/no-explicit-any */
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import OrderModel from './order.model';

// * create new order
const newOrder = CatchAsyncError(async (data: any) => {
  const order = await OrderModel.create(data);
  return order;
});

// * Get All Orders
const getAllOrders = async () => {
  const result = await OrderModel.find().sort({ createdAt: -1 });
  return result;
};

export const orderService = {
  newOrder,
  getAllOrders,
};
