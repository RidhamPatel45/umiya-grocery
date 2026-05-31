import { Router } from 'express';
import { handleRazorpayWebhook } from '../controllers/WebhookController';

const router = Router();

// Handle the POST webhook endpoint
router.post('/razorpay', handleRazorpayWebhook);

export default router;
