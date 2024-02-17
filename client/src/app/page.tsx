import getTickets from '@/actions/get-tickets';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function Home() {
  const tickets = await getTickets();

  const ticketList = tickets.map((ticket, index, row) => (
    <tr
      key={ticket.id}
      className={cn('bg-white dark:bg-gray-800', index + 1 !== row.length && 'border-b dark:border-gray-700')}
    >
      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
        {ticket.title}
      </th>
      <td className="px-6 py-4 text-right">{ticket.price.toFixed(2)}</td>
      <td className="px-6 py-4">
        <Link href={`/tickets/${ticket.id}`}>View</Link>
      </td>
    </tr>
  ));

  return (
    <div className="p-10 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold">Tickets</h1>
      <table className="w-full max-w-lg text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Title
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Link
            </th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
}
