import { Request, Response, NextFunction } from 'express';

export function secureHeaders(_req: Request, res: Response, next: NextFunction): void {
  // Prevent Clickjacking
  res.setHeader('X-Frame-Options', 'DENY');

  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Enable browser XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.razorpay.com;"
  );

  // Strict Transport Security (HSTS) if HTTPS (simulated or active)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  next();
}
