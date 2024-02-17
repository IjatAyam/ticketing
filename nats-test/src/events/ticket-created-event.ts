import { Subjects } from './subjects';

export type TicketCreatedEvent = {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
};
