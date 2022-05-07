import { BadRequestError, logger } from '@gfassignment/common';
import { TransactionCreatedPublisher } from 'events/publishers';
import { TransactionRepository } from '../repository/transaction';
import { natsWrapper } from '../../nats-wrapper';
import { TransactionMethod } from 'models/transaction';
import { TransactionRecordService } from './transactionRecord';
import { UserService } from './user';
import { TransactionRecordRepository } from 'api/repository/transactionRecord';
import { getTxFromHash } from './helper';

export class TransactionService {
  public static async listTransaction(page: number, limit: number) {
    const result = await TransactionRecordRepository.listTransaction(page, limit);
    return result;
  }

  public static async getTransactionByUserAuthId(userAuthId: string, page: number, limit: number) {
    const result = await TransactionRecordRepository.findByUserAuthId(userAuthId, page, limit);
    return result;
  }

  public static async createTransaction(hash: string) {
    const { amount, to, timestamp, parseTx, tx } = await getTxFromHash(hash);

    const fromUser = await UserService.findByWalletAddress(tx.from);
    const toUser = await UserService.findByWalletAddress(to);

    if (!fromUser) {
      throw new BadRequestError(`Sender is not registered in the platform yet!`);
    } else if (!toUser) {
      throw new BadRequestError(`Reciepient is not registered in the platform yet!`);
    } else if (!fromUser.walletAddress) {
      throw new BadRequestError('Sender does not connect wallet to the platform yet!');
    } else if (!toUser.walletAddress) {
      throw new BadRequestError('Reciepient does not connect wallet to the platform yet!');
    }

    const transactionAttrs = {
      hash: tx.hash,
      from: fromUser.walletAddress,
      to: toUser.walletAddress,
      timestamp,
      method: TransactionMethod.Transfer,
      amount: amount.toString(),
      gas: tx.gasPrice!.toString(),
      block: tx.blockNumber!,
      blockHash: tx.blockHash!,
      nonce: tx.nonce,
    };

    // create transaction
    await TransactionRepository.createTransaction(transactionAttrs);

    // create double-entry transaction records
    const { transactionRecordFrom, transactionRecordTo } =
      await TransactionRecordService.createRecord(transactionAttrs, fromUser, toUser);

    new TransactionCreatedPublisher(natsWrapper.client).publish(transactionAttrs);
    return {
      transactionRecordFrom,
      transactionRecordTo,
      transaction: transactionAttrs,
      parseTx,
    };
  }
}
