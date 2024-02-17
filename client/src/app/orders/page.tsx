import getOrders from '@/actions/get-orders';
import { cn } from '@/lib/utils';

export default async function OrderIndex() {
  const orders = await getOrders();

  const orderList = orders.map((order, index, row) => (
    <tr
      key={order.id}
      className={cn('bg-white dark:bg-gray-800', index + 1 !== row.length && 'border-b dark:border-gray-700')}
    >
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {order.ticket.title}
      </th>
      <td className="px-6 py-4 text-right">{order.ticket.price.toFixed(2)}</td>
      <td className="px-6 py-4">{order.status}</td>
    </tr>
  ));

  return (
    <div className="p-10 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold">Orders</h1>
      <table className="w-full max-w-lg text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Ticket Title
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>{orderList}</tbody>
      </table>
    </div>
  );
}
