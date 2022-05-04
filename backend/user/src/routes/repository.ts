import { InternalServerError } from '@gfassignment/common';
import { User, UserAttrs } from 'models/user';

export class UserRepository {
  public static async findByAddress(address: string) {
    const user = await User.find({ address });
    if (user.length === 1) {
      return user[0];
    }
    if (user.length > 1) {
      throw new InternalServerError('More than 1 user is found!');
    }
    return null;
  }

  public static async createUser(user: UserAttrs) {
    const newUser = User.build(user);
    await newUser.save();
    return newUser;
  }
}
