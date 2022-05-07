import { Subjects } from './subjects';

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    authId: string;
    email: string;
    name: string;
    version: number;
  };
}
