import { TransactionRecord, TransactionRecordAttrs } from 'models/transactionRecord';
import { knex, TABLES } from 'db';
import { Pagination } from 'api/service/pagination';

export class TransactionRecordRepository {
  public static async findByUserAuthId(userAuthId: string, page: number, limit: number) {
    const totalItems = +(await knex(TABLES.TransactionRecord).where({ userAuthId }).count())[0]
      .count;

    const pagination = Pagination.create(page, limit, totalItems);

    const transactions = await knex(TABLES.TransactionRecord)
      .join(TABLES.Transaction, 'txHash', 'hash')
      .where({ userAuthId })
      .offset((page - 1) * limit)
      .limit(limit);

    return { transactions, pagination };
  }

  public static async createRecord(transactionRecordAttrs: TransactionRecordAttrs) {
    return await TransactionRecord.insert(transactionRecordAttrs);
  }
}
