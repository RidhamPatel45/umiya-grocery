import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';

// ─────────────────────────────────────────────────────────────────────────────
// TypeScript Interface: Strict typing for incoming query parameters
// ─────────────────────────────────────────────────────────────────────────────
interface ProductQueryParams {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  sort?: string;
}

// Structured pagination meta returned in every response
interface PaginationMeta {
  totalProducts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/products — Optimized Pagination & Filtering Engine
// ─────────────────────────────────────────────────────────────────────────────
export const getProducts = async (
  req: Request<{}, {}, {}, ProductQueryParams>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const startTime = Date.now(); // Performance tracking

    // ── Parse & Validate Query Params ─────────────────────────────────────
    const page = Math.max(1, parseInt(req.query.page ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit ?? '12', 10)));
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim() ?? '';
    const category = req.query.category?.trim() ?? '';

    // ── Parse sort param to Mongoose sort object ───────────────────────────
    const sortMap: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      rating: { 'ratings.average': -1 },
      relevance: { score: { $meta: 'textScore' } as unknown as -1 },
    };
    const sortKey = req.query.sort ?? (search ? 'relevance' : 'newest');
    const sortObj = sortMap[sortKey] ?? { createdAt: -1 };

    // ── Build Mongoose Filter Object ───────────────────────────────────────
    // Using $text leverages the ProductTextSearchIndex (compound text index
    // on name + category + brand with weights 10/5/3)
    const filter: Record<string, unknown> = {};

    if (search) {
      filter['$text'] = { $search: search };
    }
    if (category) {
      filter['category'] = category;
    }

    // ── Execute Queries in Parallel ────────────────────────────────────────
    // Parallel execution of count + data reduces total latency significantly
    const projection = search
      ? { score: { $meta: 'textScore' } } // Include text score for relevance sort
      : {};

    const [totalProducts, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter, projection)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .select('name category brand description price stock images ratings')
        .lean(), // ← .lean() bypasses Mongoose document hydration for max speed
    ]);

    // ── Build Pagination Meta ──────────────────────────────────────────────
    const totalPages = Math.ceil(totalProducts / limit);
    const meta: PaginationMeta = {
      totalProducts,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    // ── Log execution time for performance monitoring ──────────────────────
    const executionMs = Date.now() - startTime;
    console.log(`[ProductController] getProducts: ${executionMs}ms | total=${totalProducts} | page=${page}/${totalPages}`);

    res.status(200).json({
      status: 'success',
      meta,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/products/:id — Single Product Detail
// ─────────────────────────────────────────────────────────────────────────────
export const getProductById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      res.status(404).json({ status: 'error', message: 'Product not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};
