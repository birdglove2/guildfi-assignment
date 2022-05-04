import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserAttrs } from 'models/user';

jest.mock('../nats-wrapper');

declare global {
  var dummyUserAttrs: UserAttrs;
  var dummyUserAttrs2: UserAttrs;
}

let mongo: any;
beforeAll(async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  setTimeout(function () {
    mongoose.disconnect();
  }, 1000);
});

global.dummyUserAttrs = {
  address: '0x5f958971072bf53C4C577b44d7a8a04ADce904Ba',
  name: 'wallet 1',
};

global.dummyUserAttrs2 = {
  address: '0x7fDBf34B6a59b9E0baF98032f53b8a8eBC1ba65F',
  name: 'wallet 2',
};
