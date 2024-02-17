import { Ticket } from '@/types/ticket';

export enum OrderStatus {
  Created = 'created',
  Cancelled = 'cancelled',
  AwaitingPayment = 'awaiting:payment',
  Complete = 'complete',
}

export type Order = {
  id: string;
  version: number;
  userId: string;
  expiresAt: string;
  status: OrderStatus;
  ticket: Ticket;
};
