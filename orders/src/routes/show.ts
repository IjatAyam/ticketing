import express from 'express';
import { NotAuthorizedError, NotFoundError, requireAuth } from '@ijattickets/common';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders/:orderId', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('ticket');

  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  res.send(order);
});

export { router as showOrderRouter };
