import mongoose, { Schema, model } from 'mongoose';
import { BannerImage, Category, FaqItem, Layout } from './layout.interface';
// * FaQ Schema
const faqSchema: Schema<FaqItem> = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },
});
// * Category Schema
const categorySchema: Schema<Category> = new mongoose.Schema({
  title: { type: String },
});

// * Banner Image Schema
const bannerImageSchema: Schema<BannerImage> = new mongoose.Schema({
  public_id: { type: String },
  url: { type: String },
});

// * Layout Schema
const layoutSchema: Schema<Layout> = new mongoose.Schema({
  type: { type: String },
  faq: [faqSchema],
  categories: [categorySchema],
  banner: {
    image: bannerImageSchema,
    title: { type: String },
    subTitle: { type: String },
  },
});

const LayoutModel = model<Layout>('Layout', layoutSchema);

export default LayoutModel;
