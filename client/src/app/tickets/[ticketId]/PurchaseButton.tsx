'use client';

import useRequest from '@/hooks/use-request';
import { useRouter } from 'next/navigation';
import serverRevalidateTag from '@/actions/server-revalidate-tag';

type Props = {
  ticketId: string;
};

export default function (props: Props) {
  const { ticketId } = props;

  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId,
    },
    async onSuccess(order) {
      await serverRevalidateTag('orders');
      router.push(`/orders/${order.id}`);
    },
  });

  return (
    <>
      <button className="bg-blue-500 py-2 px-4 rounded font-bold" type="button" onClick={() => doRequest()}>
        Purchase
      </button>
      {errors}
    </>
  );
}
