export interface DashboardMetrics {
  totalSales: number;
  dailyOrders: number;
  revenue: number;
  activeUsers: number;
  salesGrowth: number;
  ordersGrowth: number;
  revenueGrowth: number;
  usersGrowth: number;
}

export interface AdminOrder {
  _id: string;
  customerName: string;
  createdAt: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}
