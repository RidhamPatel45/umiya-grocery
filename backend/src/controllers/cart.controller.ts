import { Response } from 'express';
import Cart from '../models/Cart.model';
import Product from '../models/Product.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const getCart = async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images weight stock');
  res.json({ success: true, data: cart || { items: [] } });
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);
  if (product.stock < quantity) throw new AppError('Insufficient stock', 400);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

  const itemIndex = cart.items.findIndex((i: any) => i.product.toString() === productId);

  if (itemIndex > -1) {
    (cart.items[itemIndex] as any).quantity += quantity;
  } else {
    (cart.items as any[]).push({ product: productId, quantity });
  }

  await cart.save();
  res.json({ success: true, message: 'Added to cart', data: cart });
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new AppError('Cart not found', 404);

  const item = cart.items.find((i: any) => i._id.toString() === req.params.itemId);
  if (!item) throw new AppError('Item not found in cart', 404);

  if (quantity <= 0) {
    cart.items = cart.items.filter((i: any) => i._id.toString() !== req.params.itemId) as any;
  } else {
    (item as any).quantity = quantity;
  }

  await cart.save();
  res.json({ success: true, data: cart });
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Cart cleared' });
};
