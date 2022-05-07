import request from 'supertest';
import { app } from '../../app';
import { AccountType } from 'models/transactionRecord';
import { TransactionMethod } from 'models/transaction';

const dummyTransactionAttrs = global.dummyTransactionAttrs;

it('should list all transactions store in db', async () => {
  await global.createUser1WithWallet();
  await global.createUser2WithWallet();
  await global.createTransaction();

  let res = await request(app).get(`/api/v1/transaction`).expect(200);

  const { transactions, pagination } = res.body.result;

  expect(transactions[0]).toEqual(dummyTransactionAttrs);
  expect(pagination).toEqual({
    limit: 10,
    nextPage: 1,
    page: 1,
    prevPage: 1,
    totalItems: 1,
    totalPage: 1,
  });
});
