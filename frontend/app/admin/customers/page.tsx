'use client';

import { Users, UserPlus } from 'lucide-react';

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500">Manage buyer accounts, review authorization roles, and view profile metadata.</p>
        </div>
        <button
          onClick={() => alert('New user registration flow coming soon.')}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <UserPlus className="h-4 w-4" /> Add Customer
        </button>
      </div>

      <div className="flex min-h-[350px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
        <Users className="h-10 w-10 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-700">Accounts Registry</h2>
        <p className="text-sm text-slate-500 max-w-sm">
          Buyer registration records are stored securely with zero-trust token encryption. Access customer purchase logs from their billing history page.
        </p>
      </div>
    </div>
  );
}
