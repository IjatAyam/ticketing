import getOrder from '@/actions/get-order';
import CountDown from '@/app/orders/[orderId]/CountDown';
import getCurrentUser from '@/actions/get-current-user';

type Props = {
  params: {
    orderId: string;
  };
};

export default async function OrderShow(props: Readonly<Props>) {
  const { orderId } = props.params;
  const currentUser = await getCurrentUser();
  const order = await getOrder(orderId);

  return (
    <div className="p-10 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold">{order.ticket.title}</h1>
      <CountDown currentUser={currentUser!} order={order} />
    </div>
  );
}
