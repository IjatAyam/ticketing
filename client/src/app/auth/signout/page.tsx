'use client';

import { useRouter } from 'next/navigation';
import useRequest from '@/hooks/use-request';
import { useEffect } from 'react';

export default function SignOut() {
  const router = useRouter();
  const { doRequest } = useRequest({
    url: '/api/users/signout',
    method: 'post',
    async onSuccess() {
      router.push('/');
      router.refresh();
    },
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out</div>;
}
