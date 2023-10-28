import express from 'express';
import { notificationController } from './notification.controller';
import { authorizeRole, isAuthenticated } from '../../middleware/auth';

const router = express.Router();

router.get(
  '/get-all-notification',
  isAuthenticated,
  authorizeRole('admin'),
  notificationController.getNotification,
);
router.put(
  '/update-notification/:id',
  isAuthenticated,
  authorizeRole('admin'),
  notificationController.updateNotification,
);
export const NotificationRoutes = router;
