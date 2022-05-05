import { AuthAttrs } from 'models/auth';
import { AuthRepository } from '../repository/auth';
import { BadRequestError } from '@gfassignment/common';
import { Password } from './password';

export class AuthService {
  public static async createCredentials(authAttrs: AuthAttrs) {
    const { email, password } = authAttrs;
    const existingUser = await AuthRepository.findByEmail(email);

    if (existingUser) {
      throw new BadRequestError('Email is already in used!');
    }

    const hashedPassword = await Password.hash(password);
    const newUser = await AuthRepository.createCredentials({ email, password: hashedPassword });

    return newUser;
  }

  public static async findByCredentials(authAttrs: AuthAttrs) {
    const { email, password } = authAttrs;

    const existingUser = await AuthRepository.findByEmail(email);
    if (!existingUser) {
      throw new BadRequestError('Invalid email or password');
    }

    const isPasswordMatched = await Password.compare(existingUser.password, password);
    if (!isPasswordMatched) {
      throw new BadRequestError('Invalid email or password');
    }

    return existingUser;
  }
}
