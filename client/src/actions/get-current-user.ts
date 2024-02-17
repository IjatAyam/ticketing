import { headers } from 'next/headers';
import buildClient from '@/api/build-client';
import { User } from '@/types/user';

type CurrentUserResponse = {
  currentUser: User;
};

export default async function getCurrentUser() {
  const host = headers().get('Host');
  const cookie = headers().get('Cookie');
  const client = buildClient({ headers: { Host: host, Cookie: cookie } });
  const { data } = await client.get<CurrentUserResponse>('/api/users/current-user');

  return data.currentUser;
}
