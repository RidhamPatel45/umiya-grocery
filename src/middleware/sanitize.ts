import { Request, Response, NextFunction } from 'express';

// Recursively sanitize objects to prevent NoSQL query injection (stripping keys that start with $)
function sanitizeObject(obj: any): any {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key]);
      }
    }
  }
  return obj;
}

// Strip basic HTML/Script tags to prevent XSS injection in text fields
function stripXss(val: any): any {
  if (typeof val === 'string') {
    return val.replace(/<[^>]*>/g, '');
  }
  if (Array.isArray(val)) {
    return val.map(stripXss);
  }
  if (val && typeof val === 'object') {
    for (const key in val) {
      val[key] = stripXss(val[key]);
    }
  }
  return val;
}

export function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction): void {
  req.body = sanitizeObject(req.body);
  req.query = sanitizeObject(req.query);
  req.params = sanitizeObject(req.params);

  req.body = stripXss(req.body);
  req.query = stripXss(req.query);
  req.params = stripXss(req.params);

  next();
}
