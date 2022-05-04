import { NextFunction, Request, Response } from 'express';
import { failResponse, successResponse, BadRequestError } from '@gfassignment/common';
import { UserRepository } from './repository';
import { UserCreatedPublisher } from 'events/publishers';
import { natsWrapper } from 'nats-wrapper';
import { GEMContract } from 'contract';
import { ethers } from 'ethers';
import { UserAttrs } from 'models/user';

export class UserService {
  //TODO: let user sign message, then retreive the address from it instead of sending pure address
  // or let frontend authenticates address before sending address via api
  public static async createUser(userAttrs: UserAttrs) {
    const user = await UserRepository.findByAddress(userAttrs.address);
    if (user) {
      throw new BadRequestError('User already exists!');
    }

    const newUser = await UserRepository.createUser(userAttrs);
    new UserCreatedPublisher(natsWrapper.client).publish({
      id: newUser.id,
      address: newUser.address,
      name: newUser.name,
      version: newUser.version,
    });

    return newUser;
  }

  public static async showUserWithPrivateData(address: string) {}

  public static async showUser(address: string) {
    const user = await UserRepository.findByAddress(address);
    console.log(user, address);
    if (!user) {
      return;
    }

    //TODO: too slow need caching
    const balance = await GEMContract.getBalance(address);

    const result = { ...user.toJSON(), balance };
    return result;
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
