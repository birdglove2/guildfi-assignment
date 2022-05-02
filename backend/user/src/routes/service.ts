import { Request, Response } from 'express';
import { failResponse, successResponse } from '../common/utils';
import { NotFoundError, BadRequestError } from '../common';
import { UserRepository } from './repository';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';
import { GEMContract } from '../contract';
import { ethers } from 'ethers';

export class UserService {
  public static async createUser(req: Request, res: Response) {
    const { address, name } = req.body;

    const user = await UserRepository.findByAddress(address);
    if (user) {
      return failResponse(res, new BadRequestError('User already exists!'));
    }

    const newUser = await UserRepository.createUser({ address, name });
    new UserCreatedPublisher(natsWrapper.client).publish({
      id: newUser.id,
      address: newUser.address,
      name: newUser.name,
      version: newUser.version,
    });

    return successResponse(res, 201, newUser);
  }

  public static async showUser(req: Request, res: Response) {
    const { address } = req.params;

    const user = await UserRepository.findByAddress(address);
    if (!user) {
      return failResponse(res, new NotFoundError('User'));
    }

    //TODO: too slow need caching
    const balance = await GEMContract.getBalance(address);

    const result = { ...user.toJSON(), balance };
    return successResponse(res, 200, result);
  }

  //WARNING: how to get privateKey ??
  public static async transferGEM(req: Request, res: Response) {
    const toAccount = '0x7fDBf34B6a59b9E0baF98032f53b8a8eBC1ba65F';

    const { privateKey, from, to } = req.body;
    const amount = ethers.utils.parseEther('20000');
    const tx = await GEMContract.transfer(privateKey, to, amount);

    // new UserCreatedPublisher(natsWrapper.client).publish({
    //   id: newUser.id,
    //   address: newUser.address,
    //   name: newUser.name,
    //   version: newUser.version,
    // });

    return successResponse(res, 200, tx);
  }
}
