import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError, successResponse } from '@gfassignment/common';
import cors from 'cors';

import { AuthRouter } from './api/router';

const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(json());

app.use('/api/v1/auth', AuthRouter);

app.get('/', async (req, res) => {
  successResponse(res, 200, 'Hello, this is auth service');
});

app.all('*', async (req, res) => {
  throw new NotFoundError('Route');
});

app.use(errorHandler);

export { app };
