import { InternalServerError } from '@gfassignment/common';
import { UserAttrs } from 'models/user';
import { knex, TABLES } from 'db';
import { logger } from 'ethers';

export class UserRepository {
  public static async findAll() {
    return knex(TABLES.User);
  }

  public static async findByWalletAddress(walletAddress: string) {
    walletAddress = walletAddress.toUpperCase();

    const users = await knex(TABLES.User).where({ walletAddress });

    if (users.length == 0) {
      return null;
    } else if (users.length > 1) {
      throw new InternalServerError('User has more than 1 account!');
    }
    return users[0];
  }

  public static async createUser(userAttrs: UserAttrs) {
    userAttrs.walletAddress = userAttrs.walletAddress.toUpperCase();
    return knex(TABLES.User).insert(userAttrs);
  }
}
