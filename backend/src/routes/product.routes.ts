import { Router } from 'express';
import {
  getProducts, getProductById, createProduct,
  updateProduct, deleteProduct, addReview
} from '../controllers/product.controller';
import { protect, authorize } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('admin'), createProduct);
router.put('/:id', protect, authorize('admin'), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);
router.post('/:id/reviews', protect, addReview);

export default router;
