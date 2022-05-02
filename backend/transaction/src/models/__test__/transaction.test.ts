import { Transaction } from '../transaction';

const dummyTransactionAttrs = global.dummyTransactionAttrs;

it('can create and get transaction from db', async () => {
  const transaction = Transaction.build(dummyTransactionAttrs);
  await transaction.save();
  const fetchTxs = await Transaction.find({ walletAddress: dummyTransactionAttrs.walletAddress });
  expect(fetchTxs.length).toBe(1);

  const tx = fetchTxs[0];

  expect(tx.hash).toBe(dummyTransactionAttrs.hash);
  expect(tx.walletAddress).toBe(dummyTransactionAttrs.walletAddress);
  expect(tx.debit).toBe(dummyTransactionAttrs.debit.toString());
  expect(tx.credit).toBe(dummyTransactionAttrs.credit.toString());
  expect(tx.gas).toBe(dummyTransactionAttrs.gas.toString());
  expect(tx.value).toBe(dummyTransactionAttrs.value.toString());
  expect(tx.timestamp).toEqual(dummyTransactionAttrs.timestamp);
});
