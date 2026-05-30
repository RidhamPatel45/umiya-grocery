import { Router } from 'express';
import { verifyPayment } from '../controllers/order.controller';
const router = Router();
router.post('/verify', verifyPayment);
export default router;
