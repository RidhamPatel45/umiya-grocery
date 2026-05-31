// Server Component — no 'use client' directive
// Interactive cart action is delegated to AddToCartButton (client sub-component)

import Image from 'next/image';
import Link from 'next/link';
import { Star } from 'lucide-react';
import type { Product } from '@/types';
import { AddToCartButton } from './AddToCartButton';
import { formatINR } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard — Server Component
 *
 * Layout is locked to a 1:1 aspect ratio image container so the page never
 * shifts as images load (CLS = 0). The interactive "Add to Cart" action is
 * intentionally split into the AddToCartButton client sub-component because
 * Next.js 15 Server Components cannot contain onClick handlers or React hooks.
 */
export function ProductCard({ product }: ProductCardProps) {
  const price = product.price ?? 0;
  const mrp = product.mrp ?? price;
  const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const avgRating =
    typeof product.ratings === 'object'
      ? product.ratings.average
      : product.averageRating ?? 0;
  const reviewCount =
    typeof product.ratings === 'object'
      ? product.ratings.count
      : product.totalReviews ?? 0;
  const imageUrl = product.images?.[0] ?? null;
  const productSlug = product.slug || product._id;
  const categoryName =
    typeof product.category === 'object'
      ? product.category.name
      : product.category;

  return (
    <article
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
      aria-label={`Product: ${product.name}`}
    >
      {/* ── Image Region — fixed 1:1 aspect ratio eliminates CLS ── */}
      <Link
        href={`/product/${productSlug}`}
        className="block relative w-full"
        aria-label={`View ${product.name} details`}
        tabIndex={0}
      >
        <div className="relative w-full aspect-square bg-slate-50 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              priority={false}
            />
          ) : (
            /* Stable placeholder — same dimensions as real image, no shift */
            <div className="w-full h-full flex items-center justify-center text-5xl select-none" aria-hidden="true">
              🛒
            </div>
          )}

          {/* Discount Badge */}
          {discountPct > 0 && (
            <span
              className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              aria-label={`${discountPct}% discount`}
            >
              {discountPct}% OFF
            </span>
          )}

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center" aria-live="polite">
              <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* ── Product Info ──────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        {/* Category & Brand */}
        <div className="flex items-center gap-1 flex-wrap">
          {categoryName && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {categoryName}
            </span>
          )}
          {product.brand && (
            <span className="text-[10px] text-slate-400 truncate">{product.brand}</span>
          )}
        </div>

        {/* Product Name */}
        <Link href={`/product/${productSlug}`} tabIndex={-1} aria-hidden>
          <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Ratings */}
        {avgRating > 0 && (
          <div className="flex items-center gap-1" aria-label={`Rating: ${avgRating.toFixed(1)} out of 5`}>
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                  aria-hidden="true"
                />
              ))}
            </span>
            <span className="text-[10px] text-slate-400">({reviewCount})</span>
          </div>
        )}

        {/* Spacer to push price & button to bottom */}
        <div className="flex-1" />

        {/* Price Block */}
        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="text-base font-extrabold text-slate-800">{formatINR(price)}</span>
          {mrp > price && (
            <span className="text-xs text-slate-400 line-through">{formatINR(mrp)}</span>
          )}
        </div>

        {/* Add to Cart — CLIENT sub-component */}
        <AddToCartButton product={product} />
      </div>
    </article>
  );
}

export default ProductCard;
