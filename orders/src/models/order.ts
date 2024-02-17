import { OrderStatus } from '@ijattickets/common';
import mongoose from 'mongoose';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };

type OrderAttrs = {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
};

type OrderDoc = mongoose.Document & {
  userId: string;
  version: number;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
};

type OrderModel = mongoose.Model<OrderDoc> & {
  build(attrs: OrderAttrs): OrderDoc;
};

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => new Order(attrs);

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
