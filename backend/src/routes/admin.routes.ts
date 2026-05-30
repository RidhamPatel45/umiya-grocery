import { Router } from 'express';
import Order from '../models/Order.model';
import User from '../models/User.model';
import Product from '../models/Product.model';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();
router.use(protect, authorize('admin'));

router.get('/dashboard', async (_req, res) => {
  const [totalOrders, totalUsers, totalProducts, revenueAgg] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ isActive: true }),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
  ]);

  const today = new Date(); today.setHours(0,0,0,0);
  const ordersToday = await Order.countDocuments({ createdAt: { $gte: today } });

  res.json({
    success: true,
    data: {
      totalOrders, totalUsers, totalProducts, ordersToday,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
  });
});

router.get('/orders', async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query: any = {};
  if (status) query.orderStatus = status;
  const orders = await Order.find(query).sort('-createdAt')
    .skip((Number(page)-1)*Number(limit)).limit(Number(limit))
    .populate('user', 'name email mobile');
  const total = await Order.countDocuments(query);
  res.json({ success: true, data: orders, total });
});

router.put('/orders/:id/status', async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: status, $push: { statusHistory: { status, note } } },
    { new: true }
  );
  res.json({ success: true, data: order });
});

router.get('/users', async (_req, res) => {
  const users = await User.find({ role: 'customer' }).sort('-createdAt');
  res.json({ success: true, data: users });
});

export default router;
