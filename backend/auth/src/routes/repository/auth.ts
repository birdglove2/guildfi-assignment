import { Auth, AuthAttrs } from 'models/auth';

export class AuthRepository {
  public static async findByEmail(email: string) {
    return await Auth.findOne({ email });
  }

  public static async createUser(authAttrs: AuthAttrs) {
    const user = Auth.build(authAttrs);
    await user.save();
    return user;
  }
}
