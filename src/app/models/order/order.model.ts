import mongoose, { Model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

const orderSchema: Schema<IOrder> = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      // required: true,
    },
  },
  { timestamps: true },
);

const OrderModel: Model<IOrder> = mongoose.model('Order', orderSchema);

export default OrderModel;
