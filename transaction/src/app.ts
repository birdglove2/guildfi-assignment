import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {
  errorHandler,
  NotFoundError,
  successResponse,
  morganMiddleware,
} from '@gfassignment/common';
import cors from 'cors';

import { TransactionRouter } from './api/router';

const app = express();
app.use(cors());
app.use(json());
app.use(morganMiddleware);

app.use('/api/v1/transaction', TransactionRouter);

app.get('/', async (req, res) => {
  successResponse(res, 200, 'Hello, this is transaction service');
});

app.all('*', async (req, res) => {
  throw new NotFoundError('Route');
});

app.use(errorHandler);

export { app };
