import { knex, TABLES } from 'db';

export enum TransactionMethod {
  Transfer = 'Transfer',
}

// TransactionAttrs are properties requried to create a new Transaction
export interface TransactionAttrs {
  hash: string;
  from: string;
  to: string;
  method: TransactionMethod;
  amount: string;
  gas: string;
  block: number;
  blockHash: string;
  nonce: number;
  timestamp: number; // easier to store, and will be convert to readable string with moment.unix
}

export const Transaction = knex(TABLES.Transaction);
