import request from 'supertest';
import { app } from '../../app';
import { AccountType } from 'models/transactionRecord';
import { natsWrapper } from '../../nats-wrapper';

const dummyTransactionAttrs = global.dummyTransactionAttrs;

it('should return 201 if transaction and transaction records are created and emit event successfully', async () => {
  await global.createUser1WithWallet();
  await global.createUser2WithWallet();
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
it('should return 400 if sender is not in the platform yet', async () => {
  await global.createUser2WithWallet();
  const hash = dummyTransactionAttrs.hash;
  const res = await request(app).post(`/api/v1/transaction`).send({ hash }).expect(400);
  const result = res.body.result;
  expect(result[0].message).toEqual('Sender is not registered in the platform yet!');
});

it('should return 400 if reciepient is not in the platform yet', async () => {
  await global.createUser1WithWallet();
  const hash = dummyTransactionAttrs.hash;
  const res = await request(app).post(`/api/v1/transaction`).send({ hash }).expect(400);
  const result = res.body.result;
  expect(result[0].message).toEqual('Reciepient is not registered in the platform yet!');
});
