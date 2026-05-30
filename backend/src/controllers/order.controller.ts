import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.model';
import Product from '../models/Product.model';
import Cart from '../models/Cart.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = async (req: AuthRequest, res: Response) => {
  const { items, shippingAddress, paymentMethod, coupon } = req.body;

  // Validate stock & compute total
  let itemsTotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) throw new AppError(`Product not found: ${item.product}`, 404);
    if (product.stock < item.quantity) throw new AppError(`Insufficient stock for ${product.name}`, 400);

    itemsTotal += product.price * item.quantity;
    orderItems.push({ product: product._id, name: product.name, image: product.images[0], price: product.price, quantity: item.quantity });

    // Deduct stock
    await Product.findByIdAndUpdate(product._id, { $inc: { stock: -item.quantity } });
  }

  const shippingCharge = itemsTotal > 499 ? 0 : 49;
  const totalAmount = itemsTotal + shippingCharge;

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    itemsTotal,
    shippingCharge,
    totalAmount,
    paymentMethod,
    coupon,
    statusHistory: [{ status: 'placed' }],
  });

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  if (paymentMethod === 'razorpay') {
    const rpOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: order.orderId,
    });
    await Order.findByIdAndUpdate(order._id, { razorpayOrderId: rpOrder.id });
    return res.status(201).json({ success: true, order, razorpayOrder: rpOrder });
  }

  res.status(201).json({ success: true, order });
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(sign).digest('hex');

  if (expectedSign !== razorpay_signature) throw new AppError('Payment verification failed', 400);

  const order = await Order.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    { paymentStatus: 'paid', razorpayPaymentId: razorpay_payment_id, orderStatus: 'confirmed', $push: { statusHistory: { status: 'confirmed' } } },
    { new: true }
  );

  res.json({ success: true, order });
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt').populate('items.product', 'name images');
  res.json({ success: true, data: orders });
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate('items.product', 'name images');
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: order });
};
