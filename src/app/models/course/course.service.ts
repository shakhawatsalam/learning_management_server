import CourseModel from './course.model';
import { ICourse } from './course.interface';

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
export const courseService = {
  createCourse,
  getAllCourses,
};
