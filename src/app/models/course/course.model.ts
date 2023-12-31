import mongoose, { Model, Schema } from 'mongoose';
import {
  IComment,
  ICourse,
  ICourseData,
  ILink,
  IReview,
  IThumbnail,
} from './course.interface';

// * Review Schema
const reviewSchema: Schema<IReview> = new mongoose.Schema({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
});

// * Link Schema
const linkSchema: Schema<ILink> = new mongoose.Schema({
  title: String,
  url: String,
});
// * Comment Schema
const commentSchema: Schema<IComment> = new mongoose.Schema({
  user: Object,
  question: String,
  questionReplies: [Object],
});

// * Course Data Schema
const courseDataSchema: Schema<ICourseData> = new mongoose.Schema({
  title: String,
  videoUrl: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  question: [commentSchema],
});

// * Thumbnail Schema
const thumbnailSchema: Schema<IThumbnail> = new mongoose.Schema({
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
});

// * Mail Course Schema
const courseSchema: Schema<ICourse> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: thumbnailSchema,
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },

    benefits: [
      {
        title: String,
      },
    ],
    prerequisites: [
      {
        title: String,
      },
    ],
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const CourseModel: Model<ICourse> = mongoose.model('Course', courseSchema);

export default CourseModel;
