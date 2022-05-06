import { knex, TABLES } from 'db';

export enum TransactionMethod {
  Transfer = 'Transfer',
}

// TransactionAttrs are properties requried to create a new Transaction
export interface TransactionAttrs {
  // walletAddress: string; // for ref to a user for credit/debit double-entry
  hash: string;
  from: string;
  to: string;
  method: TransactionMethod;
  amount: string;
  gas: string;
  block: number;
  blockHash: string;
  nonce: number;
  timestamp: Date;
}

export const Transaction = knex(TABLES.Transaction);
