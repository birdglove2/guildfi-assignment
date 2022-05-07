import request from 'supertest';
import { app } from '../../app';
import { AccountType } from 'models/transactionRecord';
import { TransactionMethod } from 'models/transaction';

const dummyTransactionAttrs = global.dummyTransactionAttrs;
const dummyUserAttrs1 = global.dummyUserAttrs1;
const dummyUserAttrs2 = global.dummyUserAttrs2;

//TODO: test with a lot of transactions as well!!
it('should return 200 and list all transactions found by userAuthId', async () => {
  await global.createUsersWithWallet();
  await global.createTransaction();

  let res = await request(app)
    .get(`/api/v1/transaction?userAuthId=${dummyUserAttrs1.authId}`)
    .expect(200);

  let { transactions, pagination } = res.body.result;
  expect(transactions[0].userAuthId).toEqual(dummyUserAttrs1.authId);
  expect(transactions[0].txHash).toEqual(dummyTransactionAttrs.hash);
  expect(transactions[0].isCredit).toEqual(true);
  expect(transactions[0].accountType).toEqual(AccountType.Cash);
  expect(transactions[0].timestamp).toEqual(dummyTransactionAttrs.timestamp);
  expect(transactions[0].from).toEqual(dummyTransactionAttrs.from);
  expect(transactions[0].to).toEqual(dummyTransactionAttrs.to);
  expect(transactions[0].method).toEqual(TransactionMethod.Transfer);
  expect(transactions[0].gas).toEqual(dummyTransactionAttrs.gas);
  expect(transactions[0].block).toEqual(dummyTransactionAttrs.block);
  expect(transactions[0].blockHash).toEqual(dummyTransactionAttrs.blockHash);
  expect(transactions[0].nonce).toEqual(dummyTransactionAttrs.nonce);

  expect(pagination).toEqual({
    limit: 10,
    nextPage: 1,
    page: 1,
    prevPage: 1,
    totalItems: 1,
    totalPage: 1,
  });

  res = await request(app)
    .get(`/api/v1/transaction?userAuthId=${dummyUserAttrs2.authId}`)
    .expect(200);

  transactions = res.body.result.transactions;
  pagination = res.body.result.pagination;
  expect(transactions[0].userAuthId).toEqual(dummyUserAttrs2.authId);
  expect(transactions[0].txHash).toEqual(dummyTransactionAttrs.hash);
  expect(transactions[0].isCredit).toEqual(false);
  expect(transactions[0].accountType).toEqual(AccountType.Revenue);
  expect(transactions[0].timestamp).toEqual(dummyTransactionAttrs.timestamp);
  expect(transactions[0].from).toEqual(dummyTransactionAttrs.from);
  expect(transactions[0].to).toEqual(dummyTransactionAttrs.to);
  expect(transactions[0].method).toEqual(TransactionMethod.Transfer);
  expect(transactions[0].gas).toEqual(dummyTransactionAttrs.gas);
  expect(transactions[0].block).toEqual(dummyTransactionAttrs.block);
  expect(transactions[0].blockHash).toEqual(dummyTransactionAttrs.blockHash);
  expect(transactions[0].nonce).toEqual(dummyTransactionAttrs.nonce);
  expect(pagination).toEqual({
    limit: 10,
    nextPage: 1,
    page: 1,
    prevPage: 1,
    totalItems: 1,
    totalPage: 1,
  });
});

it('should return empty array if userAuthId is not found', async () => {
  let res = await request(app).get(`/api/v1/transaction?userAuthId=12313`).expect(200);

  const { transactions, pagination } = res.body.result;
  expect(transactions.length).toEqual(0);
  expect(pagination).toEqual({
    limit: 10,
    nextPage: 0,
    page: 0,
    prevPage: -1,
    totalItems: 0,
    totalPage: 0,
  });
});
