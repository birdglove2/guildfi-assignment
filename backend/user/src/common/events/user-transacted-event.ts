import { Subjects } from './subjects';

export interface UserTransactedEvent {
  subject: Subjects.UserTransacted;
  data: {
    id: string;
    version: number;
    txHash: string;
    from: string;
    to: string;
  };
}
