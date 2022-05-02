import { Transaction, TransactionAttrs, TransactionDoc } from '../models/transaction';
import { Pagination, PaginationAttrs } from '../models/pagination';

interface IFindTransactionResponse {
  transaction: TransactionDoc[];
  pagination: PaginationAttrs;
}

export class TransactionRepository {
  public static async findByWalletAddress(walletAddress: string, page: number, limit: number) {
    const totalItems = await Transaction.count().exec();
    const pagination = Pagination.create(page, limit, totalItems);

    const transactions = await Transaction.find({ walletAddress })
      .limit(limit)
      .skip((pagination.page - 1) * pagination.limit)
      .sort({ timestamp: 'desc' })
      .exec();

    return { transactions, pagination };
  }

  public static async createTransaction(transaction: TransactionAttrs) {}
}
