import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './error.middleware';
import User from '../models/User.model';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new AppError('Please log in to access this resource', 401));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) return next(new AppError('User not found or inactive', 401));
    req.user = user;
    next();
  } catch {
    next(new AppError('Invalid token', 401));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role)) {
      return next(new AppError('You do not have permission', 403));
    }
    next();
  };
};
