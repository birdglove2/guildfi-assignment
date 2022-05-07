import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, morganMiddleware } from '@gfassignment/common';
import cors from 'cors';

import { TransactionRouter } from './api/router';

const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(json());
app.use(morganMiddleware);

app.use('/api/v1/transaction', TransactionRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route');
});

app.use(errorHandler);

export { app };
