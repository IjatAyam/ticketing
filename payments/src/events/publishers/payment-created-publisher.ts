import { PaymentCreatedEvent, Publisher, Subjects } from '@ijattickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
