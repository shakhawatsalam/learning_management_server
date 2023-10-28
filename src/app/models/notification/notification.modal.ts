import mongoose, { Model, Schema } from 'mongoose';
import { INotification } from './notification.interface';

const notificationSchema: Schema<INotification> = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'unread',
    },
  },
  { timestamps: true },
);

const NotificationModal: Model<INotification> = mongoose.model(
  'Notification',
  notificationSchema,
);

export default NotificationModal;
