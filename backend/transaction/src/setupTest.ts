import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { TransactionAttrs, TransactionMethod } from './models/transaction';
import { TransactionRecordAttrs } from './models/transactionRecord';
import { UserAttrs } from './models/user';
import { ethers } from 'ethers';
import { createDbTables } from './db';
import { UserRepository } from 'api/repository/user';
import { TransactionService } from 'api/service/transaction';
jest.mock('./nats-wrapper');

declare global {
  var dummyTransactionAttrs: TransactionAttrs;
  var dummyTransactionAttrs2: TransactionAttrs;
  var dummyUserAttrs1: UserAttrs;
  var dummyUserAttrs2: UserAttrs;
  function createUsersWithWallet(): Promise<void>;
  function createTransaction(): Promise<{
    transaction: TransactionAttrs;
    transactionRecordFrom: TransactionRecordAttrs;
    transactionRecordTo: TransactionRecordAttrs;
    parseTx: ethers.utils.TransactionDescription;
  }>;
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

  await createDbTables();

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
  hash: '0x1d537aa61e47145813066dde7309a650312ea143aa9de5d6b950b746a4304290',
  from: '0XEC2B5522F284650784966E38F5F035082EF72749',
  to: '0X7FDBF34B6A59B9E0BAF98032F53B8A8EBC1BA65F',
  timestamp: new Date(),
  method: TransactionMethod.Transfer,
  amount: ethers.utils.parseEther('20000').toString(),
  gas: ethers.utils.parseEther('0.000000009178405715').toString(),
  block: 10605632,
  blockHash: '0x2af0f836db538caece2cff011d4e4c484c4ac913a91d22133312c22cc8f00fcb',
  nonce: 33,
};

global.dummyTransactionAttrs2 = {
  hash: '0xa676bf2fc1ed03a10a143a36b6330e47b742e48326c9f757d493e1f617f6c814  ',
  from: '0X7FDBF34B6A59B9E0BAF98032F53B8A8EBC1BA65F',
  to: '0XEC2B5522F284650784966E38F5F035082EF72749',
  timestamp: new Date(),
  method: TransactionMethod.Transfer,
  amount: ethers.utils.parseEther('30000').toString(),
  gas: ethers.utils.parseEther('0.000000009178405715').toString(),
  block: 10629411,
  blockHash: '0x2af0f836db538caece2cff011d4e4c484c4ac913a91d22133312c22cc8f00fcb',
  nonce: 33,
};

global.dummyUserAttrs1 = {
  walletAddress: '0XEC2B5522F284650784966E38F5F035082EF72749',
  authId: '6274f06d5c5f0216c0760342',
};

global.dummyUserAttrs2 = {
  walletAddress: '0X7FDBF34B6A59B9E0BAF98032F53B8A8EBC1BA65F',
  authId: '6274f11189400bcd48b28eaf',
};

global.createUsersWithWallet = async () => {
  await UserRepository.createUser({
    walletAddress: global.dummyUserAttrs1.walletAddress,
    authId: global.dummyUserAttrs1.authId,
  });

  await UserRepository.createUser({
    walletAddress: global.dummyUserAttrs2.walletAddress,
    authId: global.dummyUserAttrs2.authId,
  });
};

global.createTransaction = async () => {
  return await TransactionService.createTransaction(global.dummyTransactionAttrs.hash);
};
