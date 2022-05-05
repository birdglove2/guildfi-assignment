import { InternalServerError } from '@gfassignment/common';
import { User, UserAttrs } from 'models/user';

export class UserRepository {
  static async findById(id: string) {
    return await User.findById(id);
  }

  static async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  static async findByWalletAddress(walletAddress: string) {
    return await User.findOne({ walletAddress });
  }

  static async createUser(user: UserAttrs) {
    const newUser = User.build(user);
    await newUser.save();
    return newUser;
  }
}
