// Server Component for Product Detail
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import AddToCartButton from '@/components/products/AddToCartButton';
import type { Product } from '@/types';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
  try {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      console.error(`[ProductPage] Failed to fetch product ID: ${id}, status: ${res.status}`);
      return null;
    }

    const json = await res.json();
    return json.data as Product;
  } catch (error) {
    console.error(`[ProductPage] Error fetching product ID ${id}:`, error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const imageUrl = product.images?.[0] ?? null;
  const averageRating =
    typeof product.ratings === 'object'
      ? product.ratings.average
      : (product as any).averageRating ?? 0;
  const reviewCount =
    typeof product.ratings === 'object'
      ? product.ratings.count
      : (product as any).totalReviews ?? 0;

  const categoryName =
    typeof product.category === 'object'
      ? product.category.name
      : product.category;

  const inStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back button */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Catalog
          </Link>
          <span className="text-xs text-slate-400 font-mono">ID: {product._id}</span>
        </div>

        {/* Product Details Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 lg:p-12">
          
          {/* Left Column: Image Area */}
          <div className="flex flex-col justify-center items-center bg-slate-50/50 rounded-2xl p-4 sm:p-8 border border-slate-100/50 relative aspect-square overflow-hidden group">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                priority
                className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="text-slate-400 text-sm">No Image Available</div>
            )}
            
            {product.stock <= 5 && inStock && (
              <span className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-pulse">
                Only {product.stock} left!
              </span>
            )}
            {!inStock && (
              <span className="absolute top-4 left-4 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                Out of Stock
              </span>
            )}
          </div>

          {/* Right Column: Information Area */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category and Brand */}
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <span>{categoryName}</span>
                <span>•</span>
                <span>{product.brand}</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(averageRating) ? 'fill-current' : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">{averageRating.toFixed(1)}</span>
                <span className="text-xs text-slate-400">({reviewCount} customer reviews)</span>
              </div>

              {/* Price & Stock Status */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-black text-slate-900">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-sm text-slate-400">Inclusive of all taxes</span>
              </div>

              {/* Stock Badge */}
              <div className="mb-8">
                {inStock ? (
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-ping" />
                    In Stock (Ready to dispatch)
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                    <AlertTriangle className="w-3 h-3" />
                    Currently Unavailable
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="border-t border-slate-100 pt-6 mb-8">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Action Area */}
            <div className="border-t border-slate-100 pt-6">
              <div className="max-w-md">
                <AddToCartButton product={product} />
              </div>
              
              {/* Delivery Features */}
              <div className="grid grid-cols-3 gap-4 mt-8 border-t border-slate-50 pt-6 text-center text-slate-500 text-xs">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="font-semibold text-slate-700">Fast Delivery</span>
                  <span>Ahmedabad region</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="font-semibold text-slate-700">Easy Returns</span>
                  <span>Hassle-free return policy</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
                  <span className="font-semibold text-slate-700">100% Genuine</span>
                  <span>Direct from farm/brand</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
