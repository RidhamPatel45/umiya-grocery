'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types';
import { cartApi } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { useState } from 'react';

interface Props { product: Product; }

export function ProductCard({ product }: Props) {
  const [loading, setLoading] = useState(false);
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cartApi.add(product._id, 1);
    } catch {
      alert('Please login to add items to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link href={`/product/${product.slug || product._id}`} className="card group hover:shadow-md transition-all duration-200">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🛒</div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
            {discount}% OFF
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-900 text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight mb-1">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-2">{product.weight}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1">₹{product.mrp}</span>
            )}
          </div>
          {product.averageRating > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-gray-500">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {product.averageRating.toFixed(1)}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || loading}
          className="mt-2 w-full flex items-center justify-center gap-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white text-xs font-semibold py-2 rounded-lg transition-colors"
        >
          <ShoppingCart className="w-3 h-3" />
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
}
