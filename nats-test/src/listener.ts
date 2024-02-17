import { connect } from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';
import { TicketUpdatedListener } from './events/ticket-updated-listener';

console.clear();

const randomClientId = () => randomBytes(4).toString('hex');

const sc = connect('ticketing', randomClientId(), {
  url: 'http://localhost:4222',
});

sc.on('connect', () => {
  console.log('Listener connected to NATS');

  sc.on('close', () => {
    console.log('NATS connection closed!');
    process.exit();
  });

  new TicketCreatedListener(sc).listen();
  new TicketUpdatedListener(sc).listen();
});

process.on('SIGINT', () => sc.close());
process.on('SIGTERM', () => sc.close());
