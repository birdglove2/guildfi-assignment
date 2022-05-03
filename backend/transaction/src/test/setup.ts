import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { TransactionAttrs, TransactionMethod } from '../models/transaction';
import { ethers } from 'ethers';

jest.mock('../nats-wrapper');

declare global {
  var dummyTransactionAttrs: TransactionAttrs;
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

global.dummyTransactionAttrs = {
  walletAddress: '0x7fDBf34B6a59b9E0baF98032f53b8a8eBC1ba65F',
  hash: '0x1d537aa61e47145813066dde7309a650312ea143aa9de5d6b950b746a4304290',
  debit: ethers.utils.parseEther('20000'),
  credit: ethers.utils.parseEther('0'),
  from: '0x7fDBf34B6a59b9E0baF98032f53b8a8eBC1ba65F',
  to: '0xEc2B5522F284650784966E38F5f035082Ef72749',
  timestamp: new Date(),
  method: TransactionMethod.Transfer,
  value: ethers.utils.parseEther('20000'),
  gas: ethers.utils.parseEther('0.000000009178405715'),
  block: 10605632,
  blockHash: '0x2af0f836db538caece2cff011d4e4c484c4ac913a91d22133312c22cc8f00fcb',
  nonce: 33,
};
