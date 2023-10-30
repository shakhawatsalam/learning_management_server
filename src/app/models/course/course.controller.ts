/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import globalErrorHandler from '../../../utils/globalErrorHandler';
import httpStatus from 'http-status';
import cloudinary from 'cloudinary';
import { courseService } from './course.service';
import CourseModel from './course.model';
import { redis } from '../../../redis';
import {
  IAddAnswerData,
  IAddQuestionData,
  IAddReviewData,
  IAddReviewRaplayData,
} from './course.interface';
import ejs from 'ejs';
import path from 'path';
import mongoose from 'mongoose';
import sendMail from '../../../utils/sendMail';
import NotificationModal from '../notification/notification.modal';

// * Upload Course
const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: 'courses',
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      const course = await courseService.createCourse(data);

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * Edit Course
const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const courseId = req.params.id;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        // * Deleting Thumbnail From cloudinary
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);

        // * Upload Updated Thumbnail
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: 'courses',
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true },
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * get single course --- without purchasing
const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          sussess: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          '-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links',
        );

        await redis.set(courseId, JSON.stringify(course), 'EX', 604800);
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * get all courses -- without purchasing
const getAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isCacheExist = await redis.get('allCourses');
      if (isCacheExist) {
        console.log('From Redis');
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const courses = await CourseModel.find().select(
          '-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links',
        );
        console.log('From MonGoDB');
        await redis.set('allCourses', JSON.stringify(courses));
        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * get course content --- only for valid user
const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId,
      );
      // console.log(courseExists)
      if (!courseExists) {
        return next(
          new globalErrorHandler(
            'You are not eligible to access this course',
            httpStatus.NOT_FOUND,
          ),
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * add question in course
const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId } = req.body as IAddQuestionData;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(
          new globalErrorHandler('Invalid content id', httpStatus.NOT_FOUND),
        );
      }

      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(
          new globalErrorHandler('Invalid content id', httpStatus.NOT_FOUND),
        );
      }

      // * creating question object
      const newQuestion = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // * add this question to the course content
      courseContent.question.push(newQuestion);

      await NotificationModal.create({
        user: req.user?._id,
        title: 'New Question Received',
        message: `You have a new Question in ${courseContent?.title}`,
      });

      // * save the updated course
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * add answer to the question
const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, contentId, courseId, questionId }: IAddAnswerData =
        req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(
          new globalErrorHandler('Invalid content id', httpStatus.NOT_FOUND),
        );
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(
          new globalErrorHandler('Invalid content id', httpStatus.NOT_FOUND),
        );
      }

      const question = courseContent?.question?.find((item: any) =>
        item._id.equals(questionId),
      );
      if (!question) {
        return next(
          new globalErrorHandler('Invalid content id', httpStatus.NOT_FOUND),
        );
      }

      // * create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      // * add this answer to our course content
      question.questionReplies.push(newAnswer);

      await course?.save();

      if (req.user?._id === question?.user?._id) {
        // create a notification
        await NotificationModal.create({
          user: req.user?._id,
          title: 'New Question Reply Received',
          message: `You have a new Question in ${courseContent?.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const html = await ejs.renderFile(
          path.join(__dirname, '../../../mails/question-replay.ejs'),
          data,
        );

        try {
          await sendMail({
            email: question.user.email,
            subject: 'Question Reply',
            template: 'question-replay.ejs',
            data,
          });
        } catch (error: any) {
          return next(
            new globalErrorHandler(
              error.message,
              httpStatus.INTERNAL_SERVER_ERROR,
            ),
          );
        }
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * add review in course
const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      console.log(userCourseList);
      // * cheching is courseId already exist in userCourseList based on _id
      const courseExists = userCourseList?.some(
        (course: any) => course._id.toString() === courseId,
      );

      if (!courseExists) {
        return next(
          new globalErrorHandler(
            'Your are not eligible to access this course',
            httpStatus.NOT_FOUND,
          ),
        );
      }
      const course = await CourseModel.findById(courseId);
      const { rating, review }: IAddReviewData = req.body;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };

      course?.reviews.push(reviewData);
      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });

      if (course) {
        course.ratings = avg / course.reviews.length;
      }

      await course?.save();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const notification = {
        title: 'New Review Received',
        message: `${req.user?.name} has given a review In ${course?.name}`,
      };

      // create notification

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * add repay in review
const addRepayToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewRaplayData;
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(
          new globalErrorHandler('Course Not Found', httpStatus.NOT_FOUND),
        );
      }
      // * Find the specific review

      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId,
      );
      if (!review) {
        return next(
          new globalErrorHandler('Review Not Found', httpStatus.NOT_FOUND),
        );
      }

      // * Replay Data
      const replyData: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review?.commentReplies?.push(replyData);

      await course?.save();
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

const getAllCoursesAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await courseService.getAllCourses();
      res.status(200).json({
        success: true,
        result,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
      );
    }
  },
);

// * deleteCourse ----> only for admin
const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await courseService.deleteCourse(id, next);

      res.status(200).json({
        success: true,
        message: 'course deleted successfully',
        result,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.BAD_REQUEST),
      );
    }
  },
);

export const courseController = {
  uploadCourse,
  editCourse,
  getSingleCourse,
  getAllCourses,
  getCourseByUser,
  addQuestion,
  addAnswer,
  addReview,
  addRepayToReview,
  getAllCoursesAdmin,
  deleteCourse,
};
