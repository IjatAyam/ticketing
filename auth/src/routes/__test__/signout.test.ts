import request from 'supertest';
import { app } from '../../app';

const email = 'test@test.com';
const password = 'password';

const signup = () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);
};

it('clears the cookie after signing out', async () => {
  await signup();

  const response = await request(app).post('/api/users/signout').send({}).expect(200);

  expect(response.get('Set-Cookie')[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});
