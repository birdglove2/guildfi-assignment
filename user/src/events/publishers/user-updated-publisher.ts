import { Publisher, UserUpdatedEvent, Subjects } from '@gfassignment/common';

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
}
