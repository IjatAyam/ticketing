import { Publisher, Subjects, TicketUpdatedEvent } from '@ijattickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
