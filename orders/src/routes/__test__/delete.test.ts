import { Ticket } from '../../models/ticket';
import request from 'supertest';
import { Order, OrderStatus } from '../../models/order';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = global.getCookie();
  // Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(StatusCodes.CREATED);

  // Make a request to cancel the order
  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(StatusCodes.NO_CONTENT);

  // Expectation to make sure the thing is cancelled
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const user = global.getCookie();
  // Make a request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(StatusCodes.CREATED);

  // Make a request to cancel the order
  await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).send().expect(StatusCodes.NO_CONTENT);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
