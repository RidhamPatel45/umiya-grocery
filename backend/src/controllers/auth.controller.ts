import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.model';
import { AppError } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const signToken = (id: string, secret: string, expiresIn: string) =>
  jwt.sign({ id }, secret, { expiresIn } as any);

const sendTokens = (res: Response, user: any) => {
  const accessToken = signToken(user._id, process.env.JWT_SECRET!, process.env.JWT_EXPIRES_IN || '15m');
  const refreshToken = signToken(user._id, process.env.JWT_REFRESH_SECRET!, process.env.JWT_REFRESH_EXPIRES_IN || '7d');

  res.json({
    success: true,
    accessToken,
    refreshToken,
    user: {
      _id: user._id, name: user.name, email: user.email,
      mobile: user.mobile, role: user.role, avatar: user.avatar,
    },
  });
};

export const register = async (req: Request, res: Response) => {
  const { name, email, mobile, password } = req.body;
  const existing = await User.findOne({ $or: [{ email }, { mobile }] });
  if (existing) throw new AppError('Email or mobile already registered', 400);

  const user = await User.create({ name, email, mobile, password });
  sendTokens(res, user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }
  if (!user.isActive) throw new AppError('Account is deactivated', 401);
  sendTokens(res, user);
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token required', 401);

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
  const user = await User.findById(decoded.id);
  if (!user) throw new AppError('User not found', 401);

  const accessToken = signToken(user._id, process.env.JWT_SECRET!, '15m');
  res.json({ success: true, accessToken });
};

export const getMe = async (req: AuthRequest, res: Response) => {
  res.json({ success: true, user: req.user });
};

export const logout = async (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
};
