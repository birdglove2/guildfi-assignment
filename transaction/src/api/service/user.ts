import { UserRepository } from 'api/repository/user';
import { UserAttrs } from 'models/user';

export class UserService {
  public static async findByWalletAddress(walletAddress: string) {
    return await UserRepository.findByWalletAddress(walletAddress);
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
