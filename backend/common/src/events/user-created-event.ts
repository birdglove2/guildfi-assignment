import { Subjects } from './subjects';

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    authId: string;
    email: string;
    walletAddress: string;
    name: string;
    version: number;
  };
}
