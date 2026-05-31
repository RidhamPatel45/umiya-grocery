import { Router } from 'express';
import { createOrder, getDashboardMetrics, getAdminOrders, updateOrderStatus } from '../controllers/OrderController';

const router = Router();

// Order creation & payment flow
router.post('/create', createOrder);

// Admin dashboard analytical routes
router.get('/metrics', getDashboardMetrics);
router.get('/admin', getAdminOrders);
router.patch('/admin/:id/status', updateOrderStatus);

export default router;
