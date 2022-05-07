import { UserRepository } from 'api/repository/user';
import { knex, TABLES } from 'db';
import { UserAttrs } from 'models/user';

export class UserService {
  public static async listUser() {
    return UserRepository.findAll();
  }
  public static async findByWalletAddress(walletAddress: string) {
    return UserRepository.findByWalletAddress(walletAddress);
  }

  public static async updateUserWallet(userAttrs: UserAttrs) {
    const { authId, walletAddress } = userAttrs;
    const user = await UserRepository.findByWalletAddress(walletAddress);
    if (!user) {
      return UserRepository.createUser({ authId, walletAddress });
    }

    if (user.walletAddress.toUpperCase() === walletAddress) {
      return;
    }

    const up = await knex(TABLES.User).update({ walletAddress }).where({ authId });
    console.log('uip', up);
    return up;
  }
}
