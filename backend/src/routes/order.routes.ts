import { Router } from 'express';
import { createOrder, verifyPayment, getMyOrders, getOrderById } from '../controllers/order.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);
router.post('/', createOrder);
router.post('/verify-payment', verifyPayment);
router.get('/', getMyOrders);
router.get('/:id', getOrderById);

export default router;
