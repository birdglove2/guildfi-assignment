import { Transaction } from '../../models/transaction';
import request from 'supertest';
import { app } from '../../app';
import { TransactionRepository } from '../repository';

const dummyTransactionAttrs = global.dummyTransactionAttrs;

it('should find by wallet address with pagination', async () => {
  // should change this later
  for (let i = 0; i < 10; i++) {
    const transaction = Transaction.build(dummyTransactionAttrs);
    await transaction.save();
  }

  const result = await TransactionRepository.findByWalletAddress(
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
