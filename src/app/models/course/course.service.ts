import CourseModel from './course.model';
import { ICourse } from './course.interface';

// * Create Course
const createCourse = async (data: ICourse) => {
  const result = await CourseModel.create(data);
  return result;
};

export const courseService = {
  createCourse,
};
