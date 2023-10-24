import { NextFunction, Request, Response } from 'express';

export const CatchAsyncError =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (theFunk: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(theFunk(req, res, next)).catch(next);
  };
