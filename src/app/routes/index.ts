import express from 'express';
import { UserRoutes } from '../models/user/user.routes';
import { CourseRoutes } from '../models/course/course.routes';
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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
