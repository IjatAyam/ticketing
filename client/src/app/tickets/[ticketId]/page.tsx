import getTicket from '@/actions/get-ticket';
import PurchaseButton from '@/app/tickets/[ticketId]/PurchaseButton';

type Props = {
  params: {
    ticketId: string;
  };
};

export default async function TicketShow(props: Readonly<Props>) {
  const { ticketId } = props.params;
  const ticket = await getTicket(ticketId);
  return (
    <div className="p-10 flex flex-col items-center gap-8">
      <h1 className="text-2xl font-bold">{ticket.title}</h1>
      <h4 className="text-lg">Price: ${ticket.price.toFixed(2)}</h4>
      <PurchaseButton ticketId={ticket.id} />
    </div>
  );
}
