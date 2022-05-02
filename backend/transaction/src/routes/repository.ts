import { Transaction, TransactionAttrs, TransactionDoc } from '../models/transaction';
import { Pagination, PaginationAttrs } from '../models/pagination';

interface IFindTransactionResponse {
  transaction: TransactionDoc[];
  pagination: PaginationAttrs;
}

export class TransactionRepository {
  public static async findByWalletAddress(walletAddress: string, page: number, limit: number) {
    const transactions = await Transaction.find({ walletAddress })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ timestamp: 'desc' })
      .exec();

    const totalItems = await Transaction.count().exec();
    const pagination = Pagination.create(page, limit, totalItems);

    return { transactions, pagination };
  }

  public static async createTransaction(transaction: TransactionAttrs) {}
}
