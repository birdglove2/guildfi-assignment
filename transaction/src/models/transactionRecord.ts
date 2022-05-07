import { knex, TABLES } from 'db';

export enum AccountType {
  Cash = 'Cash',
  Revenue = 'Revenue',
}

export interface TransactionRecordAttrs {
  userAuthId: string; // for ref to a user for credit/debit double-entry
  txHash: string;
  isCredit: boolean;
  accountType: AccountType;
}

export const TransactionRecord = knex(TABLES.TransactionRecord);
