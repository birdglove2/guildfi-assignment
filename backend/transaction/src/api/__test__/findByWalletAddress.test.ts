import request from 'supertest';
import { app } from '../../app';
import { Transaction } from '../../models/transaction';
import { TransactionRepository } from '../repository/transaction';

const dummyTransactionAttrs = global.dummyTransactionAttrs;

it('should find by wallet address with pagination', async () => {
  // should change this later
  for (let i = 0; i < 10; i++) {
    const transaction = Transaction.build(dummyTransactionAttrs);
    await transaction.save();
  }

  let result = await TransactionRepository.findByWalletAddress(
    dummyTransactionAttrs.walletAddress,
    4,
    10
  );

  expect(result.pagination).toEqual({
    page: 1,
    limit: 10,
    prevPage: 1,
    nextPage: 1,
    totalPage: 1,
    totalItems: 10,
  });

  expect(result.transactions.length).toBe(10);

  result = await TransactionRepository.findByWalletAddress(
    dummyTransactionAttrs.walletAddress,
    4,
    3
  );
  expect(result.pagination).toEqual({
    page: 4,
    limit: 3,
    prevPage: 3,
    nextPage: 4,
    totalPage: 4,
    totalItems: 10,
  });
});

it('should balance debit/credit', async () => {});
