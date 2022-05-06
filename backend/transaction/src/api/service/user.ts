import { InternalServerError } from '@gfassignment/common';
import { UserRepository } from 'api/repository/user';
import { UserAttrs } from 'models/user';

export class UserService {
  public static async findByWalletAddress(walletAddress: string) {
    const users = await UserRepository.findByWalletAddress(walletAddress);
    // console.log('owww', walletAddress, users);
    if (users.length == 0) {
      return null;
    } else if (users.length > 1) {
      throw new InternalServerError('User has more than 1 account!');
    }
    return users[0];
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

    user.set({ walletAddress });
    return user.save();
  }
}
