'use client';

import { useState } from 'react';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/types';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
}

/**
 * Client-scoped sub-component isolated from the Server Component ProductCard.
 * This is the ONLY component allowed to read/write Zustand cart state.
 * Separation is required because Next.js 15 Server Components cannot use
 * browser event handlers (onClick) or client-side hooks.
 */
export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [justAdded, setJustAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);

  const isInCart = cartItems.some((item) => item._id === product._id);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent Link navigation inside the card
    e.stopPropagation();

    if (isOutOfStock) return;

    addItem({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      stock: product.stock,
    });

    // Show confirmation feedback briefly
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  if (isOutOfStock) {
    return (
      <button
        disabled
        className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-400 cursor-not-allowed ${className ?? ''}`}
        aria-label="Product is out of stock"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      aria-label={isInCart ? `${product.name} added to cart` : `Add ${product.name} to cart`}
      className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-emerald-500
        ${justAdded
          ? 'bg-emerald-500 text-white scale-95'
          : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white'
        } ${className ?? ''}`}
    >
      {justAdded ? (
        <>
          <Check className="w-3.5 h-3.5" aria-hidden="true" />
          Added!
        </>
      ) : (
        <>
          <ShoppingCart className="w-3.5 h-3.5" aria-hidden="true" />
          {isInCart ? 'Add More' : 'Add to Cart'}
        </>
      )}
    </button>
  );
}

export default AddToCartButton;
