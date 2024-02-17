import express from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@ijattickets/common';
import { Order, OrderStatus } from '../models/order';
import { StatusCodes } from 'http-status-codes';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId', requireAuth, async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate('ticket');
  if (!order) {
    return new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    return new NotAuthorizedError();
  }
  order.status = OrderStatus.Cancelled;
  await order.save();

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.status(StatusCodes.NO_CONTENT).send(order);
});

export { router as deleteOrderRouter };
