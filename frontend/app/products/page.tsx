// Server Component — no 'use client' directive
// Reads searchParams natively, fetches from Express backend, renders catalog

import { Suspense } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import type { ProductsApiResponse, PaginationMeta, Product } from '@/types';
import { AlertTriangle, PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface ProductsPageSearchParams {
  search?: string;
  category?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

interface ProductsPageProps {
  searchParams: Promise<ProductsPageSearchParams>; // Next.js 15: searchParams is a Promise
}

// ─────────────────────────────────────────────────────────────────────────────
// Data Fetching — asymmetric server-side fetch with 5s timeout
// ─────────────────────────────────────────────────────────────────────────────
async function fetchProducts(
  params: ProductsPageSearchParams
): Promise<ProductsApiResponse | null> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

  const qs = new URLSearchParams({
    ...(params.search && { search: params.search }),
    ...(params.category && { category: params.category }),
    ...(params.sort && { sort: params.sort }),
    page: params.page ?? '1',
    limit: params.limit ?? '12',
  });

  try {
    const res = await fetch(`${API_URL}/api/products?${qs.toString()}`, {
      next: { revalidate: 60 }, // ISR: cache for 60 seconds
      signal: AbortSignal.timeout(5000), // 5-second timeout guard
    });

    if (!res.ok) {
      console.error(`[ProductsPage] Backend returned ${res.status}`);
      return null;
    }

    return (await res.json()) as ProductsApiResponse;
  } catch (error) {
    console.error('[ProductsPage] Fetch failed:', error);
    return null; // Signals the UI to render the fallback error state
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

// Skeleton grid shown during Suspense
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-slate-100 rounded-2xl aspect-[3/4] animate-pulse" />
      ))}
    </div>
  );
}

// Error fallback — renders inline, never crashes the page
function ErrorFallback() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      <AlertTriangle className="w-12 h-12 text-amber-400" />
      <h2 className="text-lg font-bold text-slate-700">Unable to load products</h2>
      <p className="text-sm text-slate-500 max-w-sm">
        Our backend is temporarily unreachable. Please refresh the page or try again shortly.
      </p>
      <Link
        href="/products"
        className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
      >
        Retry
      </Link>
    </div>
  );
}

// Empty state
function EmptyState({ search }: { search?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <PackageSearch className="w-14 h-14 text-slate-300" />
      <h2 className="text-lg font-bold text-slate-600">No products found</h2>
      {search && (
        <p className="text-sm text-slate-400">
          No results for <strong>&ldquo;{search}&rdquo;</strong>. Try a different search term.
        </p>
      )}
      <Link href="/products" className="text-sm text-emerald-600 font-semibold hover:underline">
        Browse all products →
      </Link>
    </div>
  );
}

// Pagination controls
function Pagination({
  meta,
  params,
}: {
  meta: PaginationMeta;
  params: ProductsPageSearchParams;
}) {
  const buildUrl = (page: number) => {
    const qs = new URLSearchParams({
      ...(params.search && { search: params.search }),
      ...(params.category && { category: params.category }),
      ...(params.sort && { sort: params.sort }),
      page: String(page),
    });
    return `/products?${qs.toString()}`;
  };

  return (
    <nav
      aria-label="Product list pagination"
      className="flex items-center justify-between mt-10 border-t border-slate-100 pt-6"
    >
      <p className="text-sm text-slate-500">
        Showing page <strong>{meta.currentPage}</strong> of <strong>{meta.totalPages}</strong>
        {' '}({meta.totalProducts.toLocaleString('en-IN')} products)
      </p>
      <div className="flex items-center gap-2">
        {meta.hasPrevPage && (
          <Link
            href={buildUrl(meta.currentPage - 1)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            aria-label="Go to previous page"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </Link>
        )}
        {meta.hasNextPage && (
          <Link
            href={buildUrl(meta.currentPage + 1)}
            className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors"
            aria-label="Go to next page"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </nav>
  );
}

// Category filter chips
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price ↑', value: 'price-asc' },
  { label: 'Price ↓', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page Component — Next.js 15 Server Component
// ─────────────────────────────────────────────────────────────────────────────
export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams; // await: Next.js 15 searchParams is a Promise
  const { search, category, sort, page } = params;

  // Fire data fetch — returns null on any error
  const apiResponse = await fetchProducts(params);

  const activeSort = sort ?? 'newest';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ── Page Header ──────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          {search ? `Results for "${search}"` : 'All Products'}
        </h1>
        {category && (
          <p className="text-sm text-slate-500 mt-1">
            Filtered by category: <strong>{category}</strong>
          </p>
        )}
      </div>

      {/* ── Sort Controls ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap mb-6" role="group" aria-label="Sort products">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide mr-1">Sort:</span>
        {SORT_OPTIONS.map((opt) => {
          const qs = new URLSearchParams({
            ...(search && { search }),
            ...(category && { category }),
            sort: opt.value,
          });
          const isActive = activeSort === opt.value;
          return (
            <Link
              key={opt.value}
              href={`/products?${qs.toString()}`}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'
              }`}
              aria-current={isActive ? 'true' : undefined}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      {/* ── Main Content ─────────────────────────────────────────── */}
      {/* Graceful failure: null apiResponse = backend down, render fallback */}
      {apiResponse === null ? (
        <ErrorFallback />
      ) : apiResponse.data.length === 0 ? (
        <EmptyState search={search} />
      ) : (
        <>
          {/* ── Product Grid — responsive columns ──────────────── */}
          <Suspense fallback={<ProductGridSkeleton />}>
            <section
              aria-label="Product catalog"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {apiResponse.data.map((product: Product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </section>
          </Suspense>

          {/* ── Pagination ─────────────────────────────────────── */}
          {apiResponse.meta.totalPages > 1 && (
            <Pagination meta={apiResponse.meta} params={params} />
          )}
        </>
      )}
    </main>
  );
}
