import { NextFunction, Request, Response } from 'express';
import { failResponse, successResponse, BadRequestError } from '@gfassignment/common';
import { TransactionCreatedPublisher } from 'events/publishers';
import { TransactionRepository } from '../repository/transaction';
import { natsWrapper } from '../../nats-wrapper';
import { ethers } from 'ethers';
import { TransactionMethod } from 'models/transaction';
import { Pagination } from 'api/service/pagination';
import { GEMContract } from 'contract';

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
  public static async listTransaction(req: Request, res: Response) {
    const { walletAddress, page, limit } = req.params;

    const { p, l } = Pagination.clean(page, limit);
    const transactions = TransactionRepository.findByWalletAddress(walletAddress, p, l);

    const result = {
      transactions,
    };

    return successResponse(res, 200, result);
  }

  //TODO: check method
  public static async createTransaction(req: Request, res: Response) {
    const { hash, method } = req.body;
    const contract = GEMContract.getContractInstance();

    const tx = await isTransactionMined(hash);
    if (!tx || !tx.blockNumber || !tx.gasPrice || !tx.blockHash) {
      return failResponse(res, new BadRequestError('Transaction is not mined!'));
    }

    //TODO: create function
    const abi = ABI_METHOD[TransactionMethod.Transfer];
    const iface = new ethers.utils.Interface(abi);
    const parseTx = iface.parseTransaction({ data: tx.data });
    const to = parseTx.args[0];
    const amount: ethers.BigNumber = parseTx.args[1];

    const timestamp = (await contract.provider.getBlock(tx.blockNumber)).timestamp;

    const transactionAttrs = {
      walletAddress: tx.from,
      hash: tx.hash,
      debit: amount.toString(),
      credit: ethers.utils.parseEther('0').toString(),
      from: tx.from,
      to: to,
      timestamp: new Date(timestamp),
      method: TransactionMethod.Transfer,
      value: amount.toString(),
      gas: tx.gasPrice.toString(),
      block: tx.blockNumber,
      blockHash: tx.blockHash,
      nonce: tx.nonce,
    };

    // retrieve double-entry txs
    const { transactionFrom, transactionTo } = await TransactionRepository.createTransaction(
      transactionAttrs
    );

    new TransactionCreatedPublisher(natsWrapper.client).publish(transactionAttrs);

    return successResponse(res, 201, { transactionFrom, transactionTo, parseTx });
  }
}
