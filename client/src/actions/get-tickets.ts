import { cache } from '@/lib/cache';
import buildClient from '@/api/build-client';
import { headers } from 'next/headers';
import { Ticket } from '@/types/ticket';

async function getTickets() {
  const host = headers().get('Host');
  const client = buildClient({ headers: { Host: host } });
  const { data } = await client.get<Ticket[]>('/api/tickets');

  return data;
}

export default cache(getTickets, ['tickets'], { tags: ['tickets'] });
