import { InternalServerError } from '@gfassignment/common';
import { User, UserAttrs } from 'models/user';

export class UserRepository {
  static async findByField(field: string, value: string) {
    return await User.findOne({ [field]: value });
  }

  static async createUser(user: UserAttrs) {
    const newUser = User.build(user);
    await newUser.save();
    return newUser;
  }
}
