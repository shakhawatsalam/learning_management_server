import express from 'express';
import { authorizeRole, isAuthenticated } from '../../middleware/auth';
import { courseController } from './course.controller';

const router = express.Router();

router.post(
  '/create-course',
  isAuthenticated,
  authorizeRole('admin'),
  courseController.uploadCourse,
);
router.post(
  '/edit-course/:id',
  isAuthenticated,
  authorizeRole('admin'),
  courseController.editCourse,
);

export const CourseRoutes = router;
