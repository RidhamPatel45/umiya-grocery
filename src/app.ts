import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import webhookRoutes from './routes/webhookRoutes';
import { secureHeaders } from './middleware/secureHeaders';
import { sanitizeMiddleware } from './middleware/sanitize';
import { apiLimiter } from './middleware/rateLimiter';

const app: Application = express();

// ── Perimeter Defenses & Security Middlewares ─────────────────────────────────
app.use(secureHeaders);
app.use(cors());

// Configure JSON body parser to capture the raw body buffer on all requests
// This is critical for Razorpay webhook verification without having to order routes.
app.use(
  express.json({
    verify: (req: any, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(sanitizeMiddleware);
app.use('/api/', apiLimiter);

// ── API Routes ────────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Umiya Wholesale & Retail Hub API is operational',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/webhooks', webhookRoutes);

// Root health check
app.get('/', (_req, res) => {
  res.status(200).json({ message: "Umiya API is running successfully." });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(`[Error] ${err.message}`);
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

export default app;
