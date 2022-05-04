import { Publisher, TransactionCreatedEvent, Subjects } from '@gfassignment/common';

export class TransactionCreatedPublisher extends Publisher<TransactionCreatedEvent> {
  subject: Subjects.TransactionCreated = Subjects.TransactionCreated;
}
