import express from 'express';
import { UserRoutes } from '../models/user/user.routes';
import { CourseRoutes } from '../models/course/course.routes';
import { OrderRouter } from '../models/order/order.routes';
import { NotificationRoutes } from '../models/notification/notification.routes';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/course',
    route: CourseRoutes,
  },
  {
    path: '/order',
    route: OrderRouter,
  },
  {
    path: '/notification',
    route: NotificationRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
