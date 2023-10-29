import express from 'express';
import { authorizeRole, isAuthenticated } from '../../middleware/auth';
import { analyticsController } from './analytics.controller';

const router = express.Router();

router.get(
  '/get-user-analytics',
  isAuthenticated,
  authorizeRole('admin'),
  analyticsController.getUserAnalytics,
);
router.get(
  '/get-course-analytics',
  isAuthenticated,
  authorizeRole('admin'),
  analyticsController.getCourseAnalytics,
);
router.get(
  '/get-order-analytics',
  isAuthenticated,
  authorizeRole('admin'),
  analyticsController.getOrderAnalytics,
);

export const AnalyticsRoutes = router;
