import { Subjects } from './subjects';

export interface UserUpdatedEvent {
  subject: Subjects.UserUpdated;
  data: {
    authId: string;
    email: string;
    name: string;
    version: number;
    walletAddress?: string;
  };
}
