/* eslint-disable @typescript-eslint/consistent-type-definitions */

import { IUser } from '../user/user.interface';

// * comment Interface
export interface IComment {
  user: IUser;
  question: string;
  questionReplies: IComment[];
}

// * Review interface
export interface IReview {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies?: IComment[];
}
// * Link interface
export interface ILink {
  title: string;
  url: string;
}

// * CourseData Interface
export interface ICourseData {
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail: string;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  question: IComment[];
}
// * Thumbnail Object
export interface IThumbnail {
  public_id: string;
  url: string;
}

// * Course Intarface
export interface ICourse {
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: IThumbnail;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  purchased?: number;
}

// * Add question in course
export interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

// * add answer in course
export interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}

// * add review in course
export interface IAddReviewData {
  review: string;
  rating: number;
  userId: string;
}

// * add Replay to review data
export interface IAddReviewRaplayData {
  comment: string;
  courseId: string;
  reviewId: string;
}
