import { OrderCancelledEvent, Publisher, Subjects } from '@ijattickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
