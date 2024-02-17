'use client';

import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Order } from '@/types/order';
import { User } from '@/types/user';
import useRequest from '@/hooks/use-request';
import serverRevalidateTag from '@/actions/server-revalidate-tag';
import { useRouter } from 'next/navigation';

type Props = {
  currentUser: NonNullable<User>;
  order: Order;
};

export default function CountDown(props: Readonly<Props>) {
  const { currentUser, order } = props;
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
    },
    async onSuccess() {
      await serverRevalidateTag('orders');
      router.push('/orders');
    },
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order.expiresAt]);

  if (timeLeft < 0) {
    return <div className="text-lg">Order Expired</div>;
  }

  return (
    <>
      <div className="text-lg">Time left to pay: {timeLeft} seconds</div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51Oj2trF2wgsAN5aJATd6dQkHNSfmT418uqIzHRFqAr2Yk5lhhw4V1WdnxedpwyXbPNobJ3kpeGdXQJVyoG036MN0007S3QpXp2"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </>
  );
}
