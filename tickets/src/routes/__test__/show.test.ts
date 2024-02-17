import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(StatusCodes.NOT_FOUND);
});

it('returns the ticket if the ticket is found', async () => {
  const title = 'title';
  const price = 10;

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title,
      price,
    })
    .expect(StatusCodes.CREATED);

  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(StatusCodes.OK);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
