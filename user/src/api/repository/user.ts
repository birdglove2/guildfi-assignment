import { InternalServerError } from '@gfassignment/common';
import { User, UserAttrs, UpdateUserAttrs } from 'models/user';

export class UserRepository {
  public static async findByField(field: string, value: string) {
    return await User.findOne({ [field]: value });
  }

  public static async createUser(userAttrs: UserAttrs) {
    const newUser = User.build(userAttrs);
    await newUser.save();
    return newUser;
  }

  public static async updateUser(updateUserAttrs: UpdateUserAttrs) {
    const user = await User.findOne({ authId: updateUserAttrs.authId });
    if (!user) {
      // user must be found because of currentCredentials and requireAuth
      // if not found, something wrong.
      throw new InternalServerError('User not found in update!');
    }

    user.set({
      ...updateUserAttrs,
    });
    return await user.save();
  }
}
