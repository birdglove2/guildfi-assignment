import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { morganMiddleware, errorHandler, NotFoundError } from '@gfassignment/common';
import { UserRouter } from './api/router';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(json());
app.use(morganMiddleware);

app.use('/api/v1/user', UserRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route');
});

app.use(errorHandler);

export { app };
