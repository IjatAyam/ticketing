import { OrderStatus } from '@ijattickets/common';
import mongoose from 'mongoose';

type OrderAttrs = {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
};

type OrderDoc = mongoose.Document & {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
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
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
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
orderSchema.pre('save', function (done) {
  this.$where = {
    version: this.get('version') - 1,
  };
  done();
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    userId: attrs.userId,
    price: attrs.price,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
