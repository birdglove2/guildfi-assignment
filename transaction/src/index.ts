import { createDbTables } from 'db';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { logger } from '@gfassignment/common';
import { UserUpdatedListener } from 'events/listeners/user-updated-listener';

const start = async () => {
  if (process.env.APP_ENV !== 'local') {
    if (!process.env.POSTGRES_HOST) {
      throw new Error('POSTGRES_HOST must be defined');
    }
    if (!process.env.POSTGRES_USER) {
      throw new Error('POSTGRES_USER must be defined');
    }
    if (!process.env.POSTGRES_PASSWORD) {
      throw new Error('POSTGRES_PASSWORD must be defined');
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

      new UserUpdatedListener(natsWrapper.client).listen();

      process.on('SIGINT', () => natsWrapper.client.close());
      process.on('SIGTERM', () => natsWrapper.client.close());
    } catch (err) {
      console.error(err);
    }
  }

  await createDbTables();

  const port = process.env.PORT ? process.env.PORT : 8888;

  app.listen(port, () => {
    logger.info('APP_ENVIRONMENT===', process.env.APP_ENV);
    logger.info(`Listening on port ${port}!!!!!!!!`);
  });
};

start();
