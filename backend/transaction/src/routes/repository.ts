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

  /**
   * create double-entry tranasctions
   * @param transaction transaction attrs that is used to create a transaction
   * @returns two transactions both `From` and `To` side
   */
  public static async createTransaction(transaction: TransactionAttrs) {
    const transactionFrom = Transaction.build(transaction);

    const transactionTo = Transaction.build({
      ...transaction,
      walletAddress: transaction.to,
      debit: transaction.credit,
      credit: transaction.debit,
    });

    await transactionFrom.save();
    await transactionTo.save();

    return { transactionFrom, transactionTo };
  }
}
