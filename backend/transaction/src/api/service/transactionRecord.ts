import { TransactionAttrs, TransactionMethod } from 'models/transaction';
import { AccountType } from 'models/transactionRecord';
import { TransactionRecordRepository } from 'api/repository/transactionRecord';
import { UserAttrs } from 'models/user';

/**
 * Get two account types for double-entry transaction
 * @param method TransactionMethod
 * @returns Two types of account for both `from` and `to` side
 */
const getAccountTypes = (method: TransactionMethod) => {
  let fromAccountType, toAccountType;
  switch (method) {
    case TransactionMethod.Transfer:
      fromAccountType = AccountType.Cash;
      toAccountType = AccountType.Revenue;
      break;
  }
  return { fromAccountType, toAccountType };
};

export class TransactionRecordService {
  /**
   * Create double-entry transaction records
   * @param transactionAttrs pass from transaction service
   * @param fromUser used to get userAuthId
   * @param toUser used to get userAuthId
   * @returns two transactionRecord both `From` and `To` side
   */
  public static async createRecord(
    transactionAttrs: TransactionAttrs,
    fromUser: UserAttrs,
    toUser: UserAttrs
  ) {
    const { fromAccountType, toAccountType } = getAccountTypes(transactionAttrs.method);

    const transactionRecordAttrsFrom = {
      userAuthId: fromUser.authId,
      txHash: transactionAttrs.hash,
      isCredit: true,
      accountType: fromAccountType,
    };

    const transactionRecordAttrsTo = {
      userAuthId: toUser.authId,
      txHash: transactionAttrs.hash,
      isCredit: false,
      accountType: toAccountType,
    };

    await TransactionRecordRepository.createRecord(transactionRecordAttrsFrom);
    await TransactionRecordRepository.createRecord(transactionRecordAttrsTo);

    return {
      transactionRecordFrom: transactionRecordAttrsFrom,
      transactionRecordTo: transactionRecordAttrsTo,
    };
  }
}
