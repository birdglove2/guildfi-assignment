import { Publisher, UserTransactedEvent, Subjects } from '../../common';

export class UserTransactedPublisher extends Publisher<UserTransactedEvent> {
  subject: Subjects.UserTransacted = Subjects.UserTransacted;
}
