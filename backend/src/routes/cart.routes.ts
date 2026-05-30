import { Router } from 'express';
import { getCart, addToCart, updateCartItem, clearCart } from '../controllers/cart.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:itemId', updateCartItem);
router.delete('/', clearCart);

export default router;
