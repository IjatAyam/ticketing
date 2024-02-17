import { Subjects } from './subjects';

export type TicketUpdatedEvent = {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
  };
};
