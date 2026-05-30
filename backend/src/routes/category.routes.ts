import { Router } from 'express';
import Category from '../models/Category.model';
import { protect, authorize } from '../middleware/auth.middleware';
import { cacheGet, cacheSet } from '../config/redis';

const router = Router();

router.get('/', async (_req, res) => {
  const cached = await cacheGet('categories');
  if (cached) return res.json(JSON.parse(cached));
  const categories = await Category.find({ isActive: true }).sort('sortOrder');
  const result = { success: true, data: categories };
  await cacheSet('categories', JSON.stringify(result), 600);
  res.json(result);
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

export default router;
