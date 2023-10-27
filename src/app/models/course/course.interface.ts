/* eslint-disable @typescript-eslint/consistent-type-definitions */
// * comment Interface
export interface IComment {
  user: object;
  comment: string;
  commentReplies: IComment[];
}

// * Review interface
export interface IReview {
  user: object;
  rating: number;
  comment: string;
  commentReplies: IComment[];
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

// 4.29.02
