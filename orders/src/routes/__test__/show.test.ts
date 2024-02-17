import { Ticket } from '../../models/ticket';
import request from 'supertest';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

it('fetches the order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = global.getCookie();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(StatusCodes.CREATED);

  // make request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(StatusCodes.OK);

  expect(fetchedOrder.id).toEqual(order.id);
});

it('returns an error if one user tries to fetch another user order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = global.getCookie();
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(StatusCodes.CREATED);

  // make request to fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.getCookie())
    .send()
    .expect(StatusCodes.UNAUTHORIZED);
});
