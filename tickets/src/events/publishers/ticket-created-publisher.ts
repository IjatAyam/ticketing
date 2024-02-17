import { Publisher, Subjects, TicketCreatedEvent } from '@ijattickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
