import { cache } from '@/lib/cache';
import buildClient from '@/api/build-client';
import { headers } from 'next/headers';
import { Ticket } from '@/types/ticket';

async function getTicket(ticketId: string) {
  const host = headers().get('Host');
  const client = buildClient({ headers: { Host: host } });
  const { data } = await client.get<Ticket>(`/api/tickets/${ticketId}`);

  return data;
}

export default cache(getTicket, ['ticket'], { revalidate: 5 });
