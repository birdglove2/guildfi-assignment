import { User, UserAttrs } from 'models/user';
import { knex } from 'db';
export class UserRepository {
  public static async findByWalletAddress(walletAddress: string) {
    walletAddress = walletAddress.toUpperCase();
    const u2 = await knex('user').where({ walletAddress });
    const u3 = await knex('user').where({ walletAddress });
    return u2;
  }

  public static async createUser(userAttrs: UserAttrs) {
    // console.log('object', userAttrs);
    userAttrs.walletAddress = userAttrs.walletAddress.toUpperCase();
    // console.log('xx213', userAttrs);
    return knex('user').insert(userAttrs);
  }
}
