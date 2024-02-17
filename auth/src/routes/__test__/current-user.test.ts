import request from 'supertest';
import { app } from '../../app';

const email = 'test@test.com';
const password = 'password';

it('responds with details about the current user', async () => {
  const cookie = await global.getCookie(email, password);

  const response = await request(app).get('/api/users/current-user').set('Cookie', cookie).send().expect(200);

  expect(response.body.currentUser.email).toEqual(email);
});

it('responds with null if not authenticated', async () => {
  const response = await request(app).get('/api/users/current-user').send().expect(200);

  expect(response.body.currentUser).toEqual(null);
});
