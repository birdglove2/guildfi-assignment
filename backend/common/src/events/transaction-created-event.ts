import { Subjects } from './subjects';

export interface TransactionCreatedEvent {
  subject: Subjects.TransactionCreated;
  data: {
    walletAddress: string;
    hash: string;
    debit: string;
    credit: string;
    from: string;
    to: string;
    timestamp: Date;
    method: string;
    value: string;
    gas: string;
    block: number;
    blockHash: string;
    nonce: number;
  };
}
