import { Subjects } from './subjects';

export interface TransactionCreatedEvent {
  subject: Subjects.TransactionCreated;
  data: {
    hash: string;
    from: string;
    to: string;
    method: string;
    amount: string;
    gas: string;
    block: number;
    blockHash: string;
    nonce: number;
    timestamp: number;
  };
}
