import { ExpirationCompleteEvent, Publisher, Subjects } from '@ijattickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
