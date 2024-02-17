import { cache } from '@/lib/cache';
import buildClient from '@/api/build-client';
import { headers } from 'next/headers';
import { Order } from '@/types/order';

async function getOrders() {
  const host = headers().get('Host');
  const cookie = headers().get('Cookie');
  const client = buildClient({ headers: { Host: host, Cookie: cookie } });
  const { data } = await client.get<Order[]>('/api/orders');

  return data;
}

export default cache(getOrders, ['orders'], { tags: ['orders'] });
