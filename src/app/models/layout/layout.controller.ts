/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { CatchAsyncError } from '../../middleware/catchAsyncErrors';
import globalErrorHandler from '../../../utils/globalErrorHandler';
import httpStatus from 'http-status';
import cloudinary from 'cloudinary';
import LayoutModel from './layout.model';

// * create layout
const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(
          new globalErrorHandler(
            `${type} already exist`,
            httpStatus.BAD_REQUEST,
          ),
        );
      }
      if (type === 'Banner') {
        const { image, title, subTitle } = req.body;
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: 'Banner',
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.create(banner);
      }
      if (type === 'FAQ') {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          }),
        );
        await LayoutModel.create({ type: 'FAQ', faq: faqItems });
      }
      if (type === 'Categories') {
        const { categories } = req.body;
        const categoryItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          }),
        );
        await LayoutModel.create({
          type: 'Categories',
          categories: categoryItems,
        });
      }
      res.status(201).json({
        success: true,
        message: 'Layout created successfully',
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * edit layout
const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === 'Banner') {
        const bannerData: any = await LayoutModel.findOne({ type: 'Banner' });
        const { image, title, subTitle } = req.body;

        if (bannerData) {
          await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
        }
        const myCloud = await cloudinary.v2.uploader.upload(image, {
          folder: 'Banner',
        });
        const banner = {
          image: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          },
          title,
          subTitle,
        };
        await LayoutModel.findByIdAndUpdate(bannerData?._id, { banner });
      }
      if (type === 'FAQ') {
        const { faq } = req.body;
        const faqItem = await LayoutModel.findOne({ type: 'FAQ' });
        const faqItems = await Promise.all(
          faq.map(async (item: any) => {
            return {
              question: item.question,
              answer: item.answer,
            };
          }),
        );
        await LayoutModel.findByIdAndUpdate(faqItem?._id, {
          type: 'FAQ',
          faq: faqItems,
        });
      }
      if (type === 'Categories') {
        const { categories } = req.body;
        const categoryItem = await LayoutModel.findOne({ type: 'Categories' });
        const categoryItems = await Promise.all(
          categories.map(async (item: any) => {
            return {
              title: item.title,
            };
          }),
        );
        await LayoutModel.findByIdAndUpdate(categoryItem?._id, {
          type: 'Categories',
          categories: categoryItems,
        });
      }
      res.status(201).json({
        success: true,
        message: 'Layout Updated successfully',
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

// * get layout
const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;
      const layout = await LayoutModel.findOne({ type });
      res.status(201).json({
        success: true,
        message: 'Layout Fetched successfully',
        layout,
      });
    } catch (error: any) {
      return next(
        new globalErrorHandler(error.message, httpStatus.INTERNAL_SERVER_ERROR),
      );
    }
  },
);

export const layoutController = {
  createLayout,
  editLayout,
  getLayoutByType,
};
