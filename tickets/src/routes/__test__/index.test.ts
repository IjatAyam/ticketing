import request from 'supertest';
import { app } from '../../app';
import { StatusCodes } from 'http-status-codes';

it('can fetch a list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app).get('/api/tickets').send().expect(StatusCodes.OK);

  expect(response.body.length).toEqual(3);
});

function createTicket() {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.getCookie())
    .send({
      title: 'title',
      price: 10,
    })
    .expect(StatusCodes.CREATED);
}
