import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Product } from '../models/Product';

export const handleRazorpayWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    if (!signature) {
      res.status(400).json({ status: 'error', message: 'Missing Razorpay signature header.' });
      return;
    }

    // Retrieve raw body from request (set up in app.ts)
    const rawBody = (req as any).rawBody || req.body;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'secret';

    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      res.status(400).json({ status: 'error', message: 'Signature verification failed.' });
      return;
    }

    const payload = JSON.parse(rawBody.toString());
    const event = payload.event;

    // We only care about payment.captured event
    if (event !== 'payment.captured') {
      res.status(200).json({ status: 'success', message: 'Ignored event type.' });
      return;
    }

    const razorpayOrderId = payload.payload.payment.entity.order_id;
    if (!razorpayOrderId) {
      res.status(400).json({ status: 'error', message: 'Missing order_id in event payload.' });
      return;
    }

    // Idempotency: Query order. If already paid, return 200 immediately
    const order = await Order.findOne({ razorpayOrderId }).session(session);
    if (!order) {
      res.status(404).json({ status: 'error', message: `Order with Razorpay ID ${razorpayOrderId} not found.` });
      return;
    }

    if (order.paymentStatus === 'paid') {
      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ status: 'success', message: 'Order already processed.' });
      return;
    }

    // Atomically update order status and decrement inventory stock
    order.paymentStatus = 'paid';
    order.orderStatus = 'processing';
    await order.save({ session });

    for (const item of order.products) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true, session }
      );

      if (!updatedProduct) {
        throw new Error(`Insufficient stock or product not found for ID: ${item.productId}`);
      }
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ status: 'success', message: 'Payment verified and order finalized.' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
