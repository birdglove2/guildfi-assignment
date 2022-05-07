import { Transaction, TransactionAttrs } from 'models/transaction';

export class TransactionRepository {
  public static async createTransaction(transactionAttrs: TransactionAttrs) {
    return Transaction.insert(transactionAttrs);
  }
}
