import { Publisher, UserCreatedEvent, Subjects } from '@gfassignment/common';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
