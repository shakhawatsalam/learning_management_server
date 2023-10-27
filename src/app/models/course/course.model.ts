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
});

// * Link Schema
const linkSchema: Schema<ILink> = new mongoose.Schema({
  title: String,
  url: String,
});
// * Comment Schema
const commentSchema: Schema<IComment> = new mongoose.Schema({
  user: Object,
  comment: String,
  commentReplies: [Object],
});

// * Course Data Schema
const courseDataSchema: Schema<ICourseData> = new mongoose.Schema({
  title: String,
  videoUrl: String,
  videoThumbnail: Object,
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
    required: true,
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
});

// * Mail Course Schema
const courseSchema: Schema<ICourse> = new mongoose.Schema({
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
      type: String,
      required: true,
    },
  ],
  prerequisites: [
    {
      type: String,
      required: true,
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
});

const CourseModel: Model<ICourse> = mongoose.model('Course', courseSchema);

export default CourseModel;
