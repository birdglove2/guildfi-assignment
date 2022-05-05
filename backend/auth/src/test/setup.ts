import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { CredentialAttrs } from 'models/credential.old';
jest.mock('../nats-wrapper');

declare global {
  var dummyCredentials: CredentialAttrs;
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

global.dummyCredentials = {
  signature:
    '0xfa32b944d9679ffbb4333d19168dfa50a5ab9a62233bfd3cf8c1d43f1f72ee527dd2725666508a241f4dae91b8ebf36c0c68c92f2a0fa85a830c0ab603d17e011c',
  walletAddress: '0x5f958971072bf53c4c577b44d7a8a04adce904ba',
};
