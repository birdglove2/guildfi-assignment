import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { logger } from '@gfassignment/common';

const start = async () => {
  if (process.env.APP_ENV !== 'local') {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined');
    }
    if (!process.env.JWT_KEY) {
      throw new Error('JWT_KEY must be defined');
    }

    try {
      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID,
        process.env.NATS_CLIENT_ID,
        process.env.NATS_URL
      );
      natsWrapper.client.on('close', () => {
        logger.info('NATS connection closed!');
        process.exit();
      });
      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());

      await mongoose.connect(process.env.MONGO_URI);
      logger.info('Connected to MongoDb');
    } catch (err) {
      console.error(err);
    }
  }

  const port = process.env.PORT ? process.env.PORT : 8888;

  app.listen(port, () => {
    logger.info('APP_ENVIRONMENT===', process.env.APP_ENV);
    logger.info(`Listening on port ${port}!!!!!!!!`);
  });
};

start();
