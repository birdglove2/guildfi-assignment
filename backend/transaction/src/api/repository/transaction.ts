import { Transaction, TransactionAttrs } from 'models/transaction';
import { Pagination, PaginationAttrs } from 'api/service/pagination';
import { knex } from 'db';

export class TransactionRepository {
  // public static async listTransaction(walletAddress: string, page: number, limit: number) {
  //   Transaction.where('');
  // }

  /**
   * Given the wallet address, find all transactions with pagination
   * @param walletAddress
   * @param page
   * @param limit to limit number of result
   * @returns the limit number of transactions on the page, and the pagination detail
   */
  public static async findByWalletAddress(walletAddress: string, page: number, limit: number) {
    //TOFIX: wrong count, should count found items not all items
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
  public static async createTransactionOld(transaction: TransactionAttrs) {
    const transactionFrom = Transaction.build(transaction);

    // const transactionTo = Transaction.build({
    //   ...transaction,
    //   walletAddress: transaction.to,
    //   debit: transaction.credit,
    //   credit: transaction.debit,
    // });

    // await transactionFrom.save();
    // await transactionTo.save();

    return { transactionFrom, transactionTo: 'x' };
  }

  public static async createTransaction(transaction: TransactionAttrs) {
    return Transaction.insert(transaction);
  }
}
