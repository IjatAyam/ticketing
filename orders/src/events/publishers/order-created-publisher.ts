import { OrderCreatedEvent, Publisher, Subjects } from '@ijattickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
