'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { DashboardMetrics } from '@/types/admin';
import MetricsCard from '@/components/admin/MetricsCard';
import MetricsSkeleton from '@/components/admin/MetricsSkeleton';
import { ShoppingCart, Users, DollarSign, TrendingUp } from 'lucide-react';

export default function OverviewPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getDashboard()
      .then((res) => {
        setMetrics(res.data.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load metrics:', err);
        setError('Could not retrieve analytics data.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Overview</h1>
        </div>
        <MetricsSkeleton />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
        <TrendingUp className="h-10 w-10 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-700">Analytics Load Issue</h2>
        <p className="text-sm text-slate-500 max-w-xs">{error || 'Unable to retrieve overview metrics.'}</p>
        <button
          onClick={() => {
            setLoading(true);
            adminApi.getDashboard()
              .then((res) => setMetrics(res.data.data))
              .finally(() => setLoading(false));
          }}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Format revenue to standard INR format
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 animate-in fade-in slide-in-from-top-3 duration-500">Overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in duration-500 delay-150">
        <MetricsCard
          title="Revenue"
          value={formatINR(metrics.revenue)}
          growth={metrics.revenueGrowth}
          description="from last month"
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
        />
        <MetricsCard
          title="Total Sales"
          value={metrics.totalSales.toLocaleString()}
          growth={metrics.salesGrowth}
          description="completed orders"
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
        />
        <MetricsCard
          title="Daily Orders"
          value={metrics.dailyOrders.toLocaleString()}
          growth={metrics.ordersGrowth}
          description="total logging transactions"
          icon={<ShoppingCart className="h-5 w-5 text-amber-600" />}
        />
        <MetricsCard
          title="Active Users"
          value={metrics.activeUsers.toLocaleString()}
          growth={metrics.usersGrowth}
          description="registered users"
          icon={<Users className="h-5 w-5 text-indigo-600" />}
        />
      </div>

      {/* Analytics extra details */}
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-2">Welcome to Umiya Wholesale Admin Console</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Use the navigation links in the sidebar to review active inventory, process pending buyer orders, and view database entries. Set up webhook endpoints for Razorpay payment triggers to test direct status upgrades dynamically.
        </p>
      </div>
    </div>
  );
}
