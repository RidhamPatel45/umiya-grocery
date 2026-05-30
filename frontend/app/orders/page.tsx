'use client';
import { useEffect, useState } from 'react';
import { orderApi } from '@/lib/api';
import Link from 'next/link';
import type { Order } from '@/types';

const statusColors: Record<string, string> = {
  placed: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  processing: 'bg-yellow-100 text-yellow-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderApi.getAll().then(r => setOrders(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 text-center">Loading orders...</div>;

  if (!orders.length) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <p className="text-5xl mb-4">📦</p>
      <h2 className="text-xl font-bold text-gray-700 mb-2">No orders yet</h2>
      <Link href="/products" className="btn-primary mt-4 inline-block">Start Shopping</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <p className="font-bold text-gray-900">#{order.orderId}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
                <span className="font-bold text-gray-900">₹{order.totalAmount}</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">{order.items.length} item(s) · {order.paymentMethod.toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
