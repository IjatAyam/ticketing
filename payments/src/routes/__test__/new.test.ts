import { app } from '../../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { Order } from '../../models/order';
import { OrderStatus } from '@ijattickets/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie())
    .send({
      token: 'token',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(StatusCodes.NOT_FOUND);
});

it('returns a 401 when purchasing an order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie())
    .send({
      token: 'token',
      orderId: order.id,
    })
    .expect(StatusCodes.UNAUTHORIZED);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie(userId))
    .send({
      token: 'token',
      orderId: order.id,
    })
    .expect(StatusCodes.BAD_REQUEST);
});

it('returns a 201 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 10000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.getCookie(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(StatusCodes.CREATED);

  const stripeCharges = await stripe.charges.list({ limit: 50 });
  const stripeCharge = stripeCharges.data.find(charge => charge.amount === price * 100);

  expect(stripeCharge).toBeDefined();
  expect(stripeCharge!.currency).toEqual('usd');

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id,
  });

  expect(payment).not.toBeNull();
});
