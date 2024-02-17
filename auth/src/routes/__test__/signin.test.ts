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

it("fails when a email that does't exist is supplied", async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password,
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await signup();

  await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password: 'wrongpassword',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await signup();

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email,
      password,
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
