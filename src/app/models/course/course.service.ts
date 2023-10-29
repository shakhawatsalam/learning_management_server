import CourseModel from './course.model';
import { ICourse } from './course.interface';
import { redis } from '../../../redis';
import globalErrorHandler from '../../../utils/globalErrorHandler';
import httpStatus from 'http-status';
import { NextFunction } from 'express';

// * Create Course
const createCourse = async (data: ICourse) => {
  const result = await CourseModel.create(data);
  return result;
};

// * Get All Courses
const getAllCourses = async () => {
  const result = await CourseModel.find().sort({ createdAt: -1 });
  return result;
};

// * delete user
const deleteCourse = async (id: string, next: NextFunction) => {
  const course = await CourseModel.findById(id);
  if (!course) {
    return next(
      new globalErrorHandler('course is not found', httpStatus.NOT_FOUND),
    );
  }

  const result = await CourseModel.findByIdAndDelete(id);
  await redis.del(id);
  return result;
};
export const courseService = {
  createCourse,
  getAllCourses,
  deleteCourse,
};
