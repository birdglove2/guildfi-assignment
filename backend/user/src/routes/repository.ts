import { User, UserAttrs } from '../models/user';

export class UserRepository {
  public static async findByAddress(address: string) {
    const user = await User.find({ address: address });
    if (user.length === 1) {
      return user[0];
    }
    return null;
  }

  public static async createUser(user: UserAttrs) {
    const newUser = User.build(user);
    await newUser.save();
    return newUser;
  }
}
