import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from './common';
import cors from 'cors';

import { TransactionRouter } from './routes';

const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(json());
app.use('/api/v1/transaction', TransactionRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route');
});

app.use(errorHandler);

export { app };