'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { AdminOrder } from '@/types/admin';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = () => {
    setLoading(true);
    adminApi.getOrders()
      .then((res) => {
        setOrders(res.data.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Failed to load orders:', err);
        setError('Unable to load orders from server.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Format currency
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val);
  };

  // Status mapping to colors
  const statusColors: Record<string, string> = {
    'Processing': 'bg-blue-50 text-blue-700 border-blue-200',
    'Shipped': 'bg-purple-50 text-purple-700 border-purple-200',
    'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Cancelled': 'bg-rose-50 text-rose-700 border-rose-200',
  };

  // Optimistic UI state updates
  const handleStatusUpdate = async (orderId: string, newStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled') => {
    // 1. Capture current state for rollback
    const originalOrders = [...orders];
    const previousOrder = orders.find(o => o._id === orderId);
    if (!previousOrder) return;
    
    // If the status is already same, do nothing
    if (previousOrder.orderStatus === newStatus) return;

    // 2. Perform Optimistic Update locally
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
    setUpdatingId(orderId);

    // 3. Make API request and handle errors / rollback
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      // Success: Toast or flash success indicator
      console.log(`Successfully updated order ${orderId} to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update status on server, rolling back:', err);
      // Rollback: Reset the UI state to what it was before the change
      setOrders(originalOrders);
      alert(`Failed to update order status to ${newStatus}. Rolled back status to ${previousOrder.orderStatus}.`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-rose-200 bg-white p-8 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <h2 className="text-lg font-semibold text-slate-700">Failed to Load Orders</h2>
        <p className="text-sm text-slate-500 max-w-xs">{error}</p>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          <RefreshCw className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Orders</h1>
          <p className="text-sm text-slate-500">Manage buyer shipments, process transaction statuses, and track logistics.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reload
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <p className="text-4xl mb-2">📦</p>
            <p className="text-lg font-medium">No orders recorded in database</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-mono text-xs font-semibold text-slate-700">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{order.customerName}</TableCell>
                  <TableCell className="text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="font-bold text-slate-900">{formatINR(order.totalAmount)}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : order.paymentStatus === 'failed'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusColors[order.orderStatus] || 'bg-slate-50 text-slate-700'}`}>
                      {order.orderStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {updatingId === order._id && (
                        <Loader2 className="h-4 w-4 animate-spin text-slate-400 self-center mr-2" />
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all">
                            Update Status
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'Processing')}>
                            Processing
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'Shipped')}>
                            Shipped
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(order._id, 'Delivered')}>
                            Delivered
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-rose-600 focus:text-rose-600" onClick={() => handleStatusUpdate(order._id, 'Cancelled')}>
                            Cancelled
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
