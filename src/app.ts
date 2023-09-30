import express, { Application, NextFunction, Request, Response } from 'express';
import logger from 'morgan';
import createHttpError from 'http-errors';

import { userRouter } from './user/user.routes'

const app: Application = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response): void => {
  res.json({ msg: 'Welcome to Finding-You WSI by Mohamed Nasrullah!' });
});

app.use('/api/users', userRouter);

// catch 404 & forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('handle 404');
  next(createHttpError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('handle 500:', err);
  res.status(err.status || 500);
  res.json({ msg: err.message, data: null });
});

export default app;
