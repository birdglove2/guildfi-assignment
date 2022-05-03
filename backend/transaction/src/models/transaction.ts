import mongoose from 'mongoose';
import { BigNumber, ethers } from 'ethers';

export enum TransactionMethod {
  Transfer = 'Transfer',
}

// TransactionAttrs are properties requried to create a new Transaction
export interface TransactionAttrs {
  walletAddress: string; // for ref to a user for credit/debit double-entry
  hash: string;
  debit: string;
  credit: string;
  from: string;
  to: string;
  timestamp: Date;
  method: TransactionMethod;
  value: string;
  gas: string;
  block: number;
  blockHash: string;
  nonce: number;
}

// It is used as an intance of Transaction
interface TransactionModel extends mongoose.Model<TransactionDoc> {
  build(attrs: TransactionAttrs): TransactionDoc;
  findByEvent(event: { id: string; version: number }): Promise<TransactionDoc | null>;
}

// TransactionDoc describes what are the attrs
// inside Transaction after querying from the database
export interface TransactionDoc extends mongoose.Document {
  walletAddress: string; // for ref to a user for credit/debit double-entry
  hash: string;
  debit: string;
  credit: string;
  from: string;
  to: string;
  timestamp: Date;
  method: TransactionMethod;
  value: string;
  gas: string;
  block: number;
  blockHash: string;
  nonce: number;
}

// schema for mongoDB
const transactionSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    debit: {
      type: String,
      required: true,
    },
    credit: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    method: {
      type: String,
      require: true,
    },
    value: {
      type: String,
      require: true,
    },
    gas: {
      type: String,
      require: true,
    },
    block: {
      type: Number,
      require: true,
    },
    blockHash: {
      type: String,
      require: true,
    },
    nonce: {
      type: Number,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

transactionSchema.statics.findByEvent = (event: { id: string }) => {
  return Transaction.findOne({
    _id: event.id,
  });
};

transactionSchema.statics.build = (attrs: TransactionAttrs) => {
  return new Transaction(attrs);
};

const Transaction = mongoose.model<TransactionDoc, TransactionModel>(
  'Transaction',
  transactionSchema
);

export { Transaction };
