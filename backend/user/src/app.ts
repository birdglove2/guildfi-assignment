import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from './common';

import { UserRouter } from './routes';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use('/api/v1/user', UserRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route');
});

app.use(errorHandler);

export { app };
