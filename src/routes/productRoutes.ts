import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/ProductController';

const router = Router();

// GET /api/products        — Paginated, filterable, searchable catalog
// GET /api/products/:id    — Single product detail
router.get('/', getProducts);
router.get('/:id', getProductById);

export default router;
