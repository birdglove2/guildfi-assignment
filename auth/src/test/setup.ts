import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from 'app';
import { AuthAttrs } from 'models/auth';

jest.mock('../nats-wrapper');

declare global {
  var dummyAuthAttrs: AuthAttrs;
  function signup(): Promise<void>;
}

let mongo: any;
beforeAll(async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  process.env.JWT_KEY = 'testjwtkey';

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

global.dummyAuthAttrs = {
  email: 'test@test.com',
  password: 'thisisPassword123',
};

global.signup = async () => {
  await request(app)
    .post('/api/v1/auth/signup')
    .send({
      email: global.dummyAuthAttrs.email,
      password: global.dummyAuthAttrs.password,
      confirmPassword: global.dummyAuthAttrs.password,
    })
    .expect(201);
};

// global.dummyCredentials = {
//   signature:
//     '0xfa32b944d9679ffbb4333d19168dfa50a5ab9a62233bfd3cf8c1d43f1f72ee527dd2725666508a241f4dae91b8ebf36c0c68c92f2a0fa85a830c0ab603d17e011c',
//   walletAddress: '0x5f958971072bf53c4c577b44d7a8a04adce904ba',
// };
