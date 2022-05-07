import request from 'supertest';
import { app } from '../../app';
import { AccountType } from 'models/transactionRecord';
import { natsWrapper } from '../../nats-wrapper';

const dummyTransactionAttrs = global.dummyTransactionAttrs;

it('should return 201 if transaction and transaction records are created and emit event successfully', async () => {
  await global.createUsersWithWallet();
  const hash = dummyTransactionAttrs.hash;

  const res = await request(app).post(`/api/v1/transaction`).send({ hash });
  const result = res.body.result;
  const { transaction, transactionRecordFrom, transactionRecordTo } = result;

  // check Transaction
  expect(transaction.hash).toEqual(hash);
  expect(transaction.from).toEqual(dummyTransactionAttrs.from);
  expect(transaction.to).toEqual(dummyTransactionAttrs.to);

  // check TransactionRecord
  expect(transactionRecordFrom.txHash).toEqual(hash);
  expect(transactionRecordFrom.isCredit).toEqual(true);
  expect(transactionRecordFrom.userAuthId).toEqual(dummyUserAttrs1.authId);
  expect(transactionRecordFrom.accountType).toEqual(AccountType.Cash);

  expect(transactionRecordTo.txHash).toEqual(hash);
  expect(transactionRecordTo.isCredit).toEqual(false);
  expect(transactionRecordTo.userAuthId).toEqual(dummyUserAttrs2.authId);
  expect(transactionRecordTo.accountType).toEqual(AccountType.Revenue);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData).toEqual(dummyTransactionAttrs);
});

it('should return 400 if user are not in the platform yet', async () => {
  const hash = '0x9eb141b97e9862eaf107a9a5bc4629b88fd5e3e113ff2dc9868f9a5ab3cf5ba6';
  const res = await request(app).post(`/api/v1/transaction`).send({ hash }).expect(400);
  const result = res.body.result;
  expect(result[0].message).toEqual('Users are not registered in the platform yet!');
});
