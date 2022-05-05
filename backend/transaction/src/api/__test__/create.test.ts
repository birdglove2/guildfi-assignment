import request from 'supertest';
import { app } from '../../app';
import { ethers } from 'ethers';
import { natsWrapper } from '../../nats-wrapper';

it('should create transaction and emit events', async () => {
  const hash = '0x9eb141b97e9862eaf107a9a5bc4629b88fd5e3e113ff2dc9868f9a5ab3cf5ba6';
  const amount = ethers.utils.parseEther('23400').toString();
  const res = await request(app).post(`/api/v1/transaction`).send({ hash }).expect(201);

  const { transactionFrom, transactionTo } = res.body.result;

  // check hash value, from/to
  expect(transactionFrom.hash).toBe(transactionTo.hash);
  expect(transactionFrom.walletAddress).toBe(transactionTo.from);
  expect(transactionFrom.from).toBe(transactionTo.from);
  expect(transactionFrom.to).toBe(transactionTo.walletAddress);
  expect(transactionFrom.to).toBe(transactionTo.to);
  expect(transactionFrom.timestamp).toBe(transactionTo.timestamp);
  expect(transactionFrom.method).toBe(transactionTo.method);
  expect(transactionFrom.gas).toBe(transactionTo.gas);
  expect(transactionFrom.block).toBe(transactionTo.block);
  expect(transactionFrom.blockHash).toBe(transactionTo.blockHash);
  expect(transactionFrom.nonce).toBe(transactionTo.nonce);

  // check amount and credit/debit
  expect(transactionFrom.value).toBe(amount);
  expect(transactionTo.value).toBe(amount);
  expect(transactionFrom.debit).toBe(transactionTo.credit);
  expect(transactionFrom.credit).toBe(transactionTo.debit);

  // check event emits
  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
  expect(eventData.hash).toEqual(transactionFrom.hash);
  expect(eventData.from).toEqual(transactionFrom.from);
  expect(eventData.to).toEqual(transactionFrom.to);

  expect(eventData.value).toEqual(transactionFrom.value);
  expect(eventData.credit).toEqual(transactionFrom.credit);
  expect(eventData.debit).toEqual(transactionFrom.debit);
  expect(eventData.gas).toEqual(transactionFrom.gas);
});