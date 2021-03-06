import { NextFunction, Request, Response } from 'express';
import {
  failResponse,
  successResponse,
  BadRequestError,
  NotFoundError,
  GEMContract,
} from '@gfassignment/common';
import { UserRepository } from '../repository/user';
import { UserCreatedPublisher, UserUpdatedPublisher } from 'events/publishers';
import { natsWrapper } from '../../nats-wrapper';
import { ethers } from 'ethers';
import { UserAttrs, UpdateUserAttrs } from 'models/user';

export class UserService {
  public static async findByField(field: string, value: string) {
    const user = await UserRepository.findByField(field, value);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (!user.walletAddress) {
      return { ...user.toJSON(), balance: 0 };
    }

    //TODO: too slow need caching
    const balance = await GEMContract.getBalance(user.walletAddress);
    return { ...user.toJSON(), balance };
  }

  //TODO: let user sign message, then retreive the address from it instead of sending pure address
  // or let frontend authenticates address before sending address via api
  public static async createUser(userAttrs: UserAttrs) {
    const user = await UserRepository.findByField('authId', userAttrs.authId);
    if (user) {
      throw new BadRequestError('User already exists!');
    }

    const newUser = await UserRepository.createUser(userAttrs);

    new UserCreatedPublisher(natsWrapper.client).publish({
      authId: newUser.authId,
      email: newUser.email,
      name: newUser.name,
      version: newUser.version,
    });

    return newUser;
  }

  public static async updateUser(updateUserAttrs: UpdateUserAttrs) {
    const updatedUser = await UserRepository.updateUser(updateUserAttrs);
    new UserUpdatedPublisher(natsWrapper.client).publish({
      authId: updatedUser.authId,
      email: updatedUser.email,
      walletAddress: updatedUser.walletAddress,
      name: updatedUser.name,
      version: updatedUser.version,
    });

    return updatedUser;
  }

  //WARNING: how to get privateKey ??
  public static async transferGEM(req: Request, res: Response, next: NextFunction) {
    const { privateKey, to, amount } = req.body;

    try {
      const parseAmount = ethers.utils.parseEther(amount);
      const tx = await GEMContract.transfer(privateKey, to, parseAmount);

      //TODO: check transaction
      const publishTx = {
        chainId: tx.chainId,
        nonce: tx.nonce,
        gasPrice: tx.gasPrice,
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        timestamp: 'xxx',
        block: 100,
        status: 'success?',
        tokensTransferred: parseAmount,
      };

      //TODO:
      // new UserTransactedPublisher(natsWrapper.client).publish(publishTx);

      return successResponse(res, 200, tx);
    } catch (err) {
      //TODO: should find other way of detecting specific error
      if (err instanceof Error) {
        return failResponse(res, new BadRequestError('Transfer failed: ' + err.message));
      }
    }
  }
}
