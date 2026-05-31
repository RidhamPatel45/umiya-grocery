'use client';

import { Box, Plus } from 'lucide-react';

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Products Inventory</h1>
          <p className="text-sm text-slate-500">Manage catalog catalog items, prices, descriptions, and stock counts.</p>
        </div>
        <button
          onClick={() => alert('New product creation modal coming soon.')}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="flex min-h-[350px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
        <Box className="h-10 w-10 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-700">Catalog Integration</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          Product catalogue management is handled via the root catalog. Access dynamic filters to sort grocery items.
        </p>
      </div>
    </div>
  );
}
