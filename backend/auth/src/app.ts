import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from '@gfassignment/common';
import cors from 'cors';

import { AuthRouter } from './routes';

const app = express();
app.use(cors());
app.set('trust proxy', true);
app.use(json());

app.use('/api/v1/auth', AuthRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route');
});

app.use(errorHandler);

export { app };
