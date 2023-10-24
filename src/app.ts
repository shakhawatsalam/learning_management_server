import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
const app: Application = express();
import cookieParser from 'cookie-parser';
import config from './config';

app.use(
  cors({
    origin: config.origin,
  }),
);

// * parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// *
app.use(cookieParser());

// * Testing
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// * unknown route
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

export default app;
