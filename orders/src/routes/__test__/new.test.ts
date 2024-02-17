import mongoose from 'mongoose';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({
      ticketId,
    })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'randomUserId',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(StatusCodes.CREATED);
});

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.getCookie())
    .send({
      ticketId: ticket.id,
    })
    .expect(StatusCodes.CREATED);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
