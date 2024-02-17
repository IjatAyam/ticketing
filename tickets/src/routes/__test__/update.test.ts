import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.getCookie())
    .send({
      title: 'title',
      price: 10,
    })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'title',
      price: 10,
    })
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app).post('/api/tickets').set('Cookie', global.getCookie()).send({
    title: 'title',
    price: 10,
  });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.getCookie())
    .send({
      title: 'updated title',
      price: 1000,
    })
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.getCookie();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'title',
    price: 10,
  });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 1000,
    })
    .expect(StatusCodes.BAD_REQUEST);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'updated title',
      price: -10,
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.getCookie();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'title',
    price: 10,
  });
  const newTitle = 'updated title';
  const newPrice = 1000;
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(StatusCodes.OK);
  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send();
  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(newPrice);
});

it('publishes an event', async () => {
  const cookie = global.getCookie();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'title',
    price: 10,
  });
  const newTitle = 'updated title';
  const newPrice = 1000;
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: newPrice,
    })
    .expect(StatusCodes.OK);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.getCookie();
  const response = await request(app).post('/api/tickets').set('Cookie', cookie).send({
    title: 'title',
    price: 10,
  });
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(StatusCodes.BAD_REQUEST);
});
