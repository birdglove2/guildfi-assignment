import { createDbTables } from 'db';
import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { logger } from '@gfassignment/common';

const start = async () => {
  if (process.env.APP_ENV !== 'local') {
    // TODO: check postgres

    if (!process.env.NATS_CLIENT_ID) {
      throw new Error('NATS_CLIENT_ID must be defined');
    }
    if (!process.env.NATS_URL) {
      throw new Error('NATS_URL must be defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
      throw new Error('NATS_CLUSTER_ID must be defined');
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
    } catch (err) {
      console.error(err);
    }
  }

  await createDbTables();

  const port = process.env.PORT ? process.env.PORT : 8888;

  app.listen(port, () => {
    logger.info(process.env.APP_ENV);
    logger.info(`Listening on port ${port}!!!!!!!!`);
  });
};

start();
