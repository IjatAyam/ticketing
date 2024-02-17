import mongoose from "mongoose";

type PaymentAttrs = {
  orderId: string;
  stripeId: string;
};

type PaymentDoc = mongoose.Document & {
  orderId: string;
  stripeId: string;
}

type PaymentModel = mongoose.Model<PaymentDoc> & {
  build(attrs: PaymentAttrs): PaymentDoc;
};

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true
  },
  stripeId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(_doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

paymentSchema.statics.build = (attrs: PaymentAttrs) => new Payment(attrs);

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', paymentSchema);

export { Payment };
