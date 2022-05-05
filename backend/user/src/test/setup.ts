import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { UserAttrs } from 'models/user';
import jwt from 'jsonwebtoken';
import { GEMContract } from 'contract';
import { Wallet } from 'ethers';
import request from 'supertest';
import { app } from '../app';

jest.mock('../nats-wrapper');

interface ICreateUserResponse {
  user: UserAttrs;
  token: string;
}

declare global {
  var dummyUserAttrs0: UserAttrs;
  var dummyUserAttrs1: UserAttrs;
  var dummyUserAttrs2: UserAttrs;
  function login(): string;
  function createUser(): Promise<ICreateUserResponse>;
}

let mongo: any;
beforeAll(async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  process.env.JWT_KEY = 'testjwtkey';
  process.env.SIGN_MESSAGE = 'test message';

  process.env.WALLET0 = '0xFde5d775c0a8EC717309e60d76c753E2f6EE36AB';
  process.env.PRIVATE_KEY0 = '7e6d0622f5db3dd8aaedea5cc19482fed03e2183291c38289bb060d1482a86b4';

  const contract = GEMContract.getContractInstance();
  const signer = new Wallet(process.env.PRIVATE_KEY0, contract.provider);
  const signature = await signer.signMessage(process.env.SIGN_MESSAGE);
  process.env.SIGNATURE0 = signature;

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

global.dummyUserAttrs0 = {
  authId: '6273b45bbeb6a1ca47fedbec',
  email: 'test0@test.com',
  walletAddress: '0xFde5d775c0a8EC717309e60d76c753E2f6EE36AB',
  name: 'wallet 0',
};

global.dummyUserAttrs1 = {
  authId: '6273a5c07468f8a80448a6e4',
  email: 'test1@test.com',
  walletAddress: '0x5f958971072bf53C4C577b44d7a8a04ADce904Ba',
  name: 'wallet 1',
};

global.dummyUserAttrs2 = {
  authId: '6273a5c94963a2777238dc38',
  email: 'test2@test.com',
  walletAddress: '0x7fDBf34B6a59b9E0baF98032f53b8a8eBC1ba65F',
  name: 'wallet 2',
};

global.login = () => {
  // Build a JWT payload.  { id, email }
  const payload = {
    authId: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  return token;
};

global.createUser = async () => {
  const token = global.login();
  const res = await request(app)
    .post('/api/v1/user')
    .set('Authorization', `Bearer ${token}`)
    .send({ ...dummyUserAttrs0, signature: process.env.SIGNATURE0 })
    .expect(201);

  return { token, user: res.body.result };
};
