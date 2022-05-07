import { BadRequestError, GEMContract } from '@gfassignment/common';
import { TransactionMethod } from 'models/transaction';
import { ethers } from 'ethers';

export const METHOD_TO_ABI_FUNCTION = {
  Transfer: ['function transfer(address recipient, uint256 amount)'],
};

/**
 * Get transaction receipt/detail from hash
 * @param txHash a transaction hash
 * @returns see function formatTx(tx) below
 */
export const getTxFromHash = async (txHash: string) => {
  const tx = await isTransactionMined(txHash);
  if (!tx || !tx.blockNumber || !tx.gasPrice || !tx.blockHash) {
    throw new BadRequestError('Transaction is not mined!');
  }

  return formatTx(tx);
};

/**
 *
 * @param tx the mined transaction
 * @returns 1. amount = how much GEM was transfered
 *          2. to = the actual receipient address, not the contract address
 *          3. timestamp in number
 *          4. parseTx = the tx that already be parsed
 *          5. tx = transaction before parsed itself
 */
export const formatTx = async (tx: ethers.providers.TransactionResponse) => {
  const contract = GEMContract.getContractInstance();

  const abi = METHOD_TO_ABI_FUNCTION[TransactionMethod.Transfer];
  const iface = new ethers.utils.Interface(abi);
  const parseTx = iface.parseTransaction({ data: tx.data });

  const to = parseTx.args[0];
  const amount: ethers.BigNumber = parseTx.args[1];
  const timestamp = (await contract.provider.getBlock(tx.blockNumber!)).timestamp;

  return { amount, to, timestamp, parseTx, tx };
};

/**
 * check if the tx has been mined on the blockchain yet
 * if not will wait until mined
 * @param txHash a transaction hash
 * @returns receipt/detail of mined tx
 */
const isTransactionMined = async (txHash: string) => {
  const contract = GEMContract.getContractInstance();

  //TODO: handle error invalid hash
  const txReceipt = await contract.provider.getTransaction(txHash);
  if (txReceipt && txReceipt.blockNumber) {
    return txReceipt;
  }
};
