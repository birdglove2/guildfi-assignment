import { Request, Response } from 'express';
import { failResponse, successResponse, BadRequestError } from '@gfassignment/common';
import { TransactionCreatedPublisher } from 'events/publishers';
import { TransactionRepository } from '../repository/transaction';
import { natsWrapper } from '../../nats-wrapper';
import { ethers } from 'ethers';
import { TransactionMethod } from 'models/transaction';
import { Pagination } from 'api/service/pagination';
import { GEMContract } from 'contract';
import { TransactionRecordService } from './transactionRecord';
import { UserService } from './user';
import { TransactionRecordRepository } from 'api/repository/transactionRecord';
import moment from 'moment';

const isTransactionMined = async (transactionHash: string) => {
  const contract = GEMContract.getContractInstance();

  //TODO: handle error invalid hash
  const txReceipt = await contract.provider.getTransaction(transactionHash);
  if (txReceipt && txReceipt.blockNumber) {
    return txReceipt;
  }
};

//TODO:
const ABI_METHOD = {
  Transfer: ['function transfer(address recipient, uint256 amount)'],
};

export class TransactionService {
  public static async listTransaction(userAuthId: string, page: number, limit: number) {
    // if(userAuthId) {
    const result = await TransactionRecordRepository.findByUserAuthId(userAuthId, page, limit);

    return result;
  }

  //TODO: check method
  public static async createTransaction(hash: string) {
    const contract = GEMContract.getContractInstance();

    // await TransactionRepository.testCreate('ASdas');
    const tx = await isTransactionMined(hash);
    if (!tx || !tx.blockNumber || !tx.gasPrice || !tx.blockHash) {
      throw new BadRequestError('Transaction is not mined!');
    }
    // console.log('ccc1');

    //TODO: create function
    const abi = ABI_METHOD[TransactionMethod.Transfer];
    const iface = new ethers.utils.Interface(abi);
    const parseTx = iface.parseTransaction({ data: tx.data });
    const to = parseTx.args[0];
    const amount: ethers.BigNumber = parseTx.args[1];

    const fromUser = await UserService.findByWalletAddress(tx.from);
    // console.log('to', to);
    const toUser = await UserService.findByWalletAddress(to);

    // console.log('ccc', fromUser, toUser);
    if (!fromUser || !toUser) {
      // console.log({ fromUser, toUser });
      throw new BadRequestError('Users are not registered in the platform yet!');
    } else if (!fromUser.walletAddress || !toUser.walletAddress) {
      throw new BadRequestError('Users are not connect their wallet to the platform yet!');
    }

    const timestamp = (await contract.provider.getBlock(tx.blockNumber)).timestamp;

    const transactionAttrs = {
      hash: tx.hash,
      from: fromUser.walletAddress,
      to: toUser.walletAddress,
      timestamp,
      method: TransactionMethod.Transfer,
      amount: amount.toString(),
      gas: tx.gasPrice.toString(),
      block: tx.blockNumber,
      blockHash: tx.blockHash,
      nonce: tx.nonce,
    };

    // create transaction
    await TransactionRepository.createTransaction(transactionAttrs);

    // create transaction record
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
