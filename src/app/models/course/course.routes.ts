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
router.get('/get-course/:id', courseController.getSingleCourse);
router.get('/get-courses', courseController.getAllCourses);
router.get(
  '/get-course-content/:id',
  isAuthenticated,
  courseController.getCourseByUser,
);

export const CourseRoutes = router;
