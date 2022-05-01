import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { errorHandler, NotFoundError } from './common';

import { createUserRouter } from './routes/create';
import { showUserRouter } from './routes/show';

const app = express();
app.set('trust proxy', true);
app.use(json());

app.use(createUserRouter);
app.use(showUserRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError('Route');
});

app.use(errorHandler);

export { app };
