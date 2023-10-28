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
router.put('/add-question', isAuthenticated, courseController.addQuestion);
router.put('/add-answer', isAuthenticated, courseController.addAnswer);
router.put('/add-review/:id', isAuthenticated, courseController.addReview);
router.put(
  '/add-reply',
  isAuthenticated,
  authorizeRole('admin'),
  courseController.addRepayToReview,
);

export const CourseRoutes = router;
