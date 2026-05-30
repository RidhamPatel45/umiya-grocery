import { Request, Response } from 'express';
import Product from '../models/Product.model';
import { cacheGet, cacheSet, cacheDel } from '../config/redis';
import { AuthRequest } from '../middleware/auth.middleware';

export const getProducts = async (req: Request, res: Response) => {
  const {
    page = 1, limit = 20, search, category, minPrice, maxPrice,
    sortBy = 'createdAt', order = 'desc', featured
  } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const query: any = { isActive: true };

  if (search) query.$text = { $search: search as string };
  if (category) query.category = category;
  if (featured) query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const cacheKey = `products:${JSON.stringify(req.query)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort({ [sortBy as string]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Product.countDocuments(query),
  ]);

  const result = {
    success: true,
    data: products,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  };

  await cacheSet(cacheKey, JSON.stringify(result), 60);
  res.json(result);
};

export const getProductById = async (req: Request, res: Response) => {
  const cacheKey = `product:${req.params.id}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const product = await Product.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }] })
    .populate('category', 'name slug');
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  const result = { success: true, data: product };
  await cacheSet(cacheKey, JSON.stringify(result), 300);
  res.json(result);
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  await cacheDel('products:*');
  res.status(201).json({ success: true, data: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  await cacheDel(`product:${req.params.id}`);
  res.json({ success: true, data: product });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, message: 'Product deactivated' });
};

export const addReview = async (req: AuthRequest, res: Response) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  (product.reviews as any[]).push({ user: req.user._id, rating, comment });
  product.totalReviews = product.reviews.length;
  product.averageRating = product.reviews.reduce((sum, r: any) => sum + r.rating, 0) / product.reviews.length;
  await product.save();

  res.status(201).json({ success: true, message: 'Review added' });
};
