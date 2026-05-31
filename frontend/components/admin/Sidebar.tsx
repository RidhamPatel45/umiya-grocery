'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Box, ShoppingCart, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Overview', href: '/admin/overview', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Box },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col flex-1 gap-1 p-4">
      <div className="mb-6 px-3">
        <span className="text-lg font-bold text-slate-800">Umiya Admin</span>
      </div>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors font-medium',
              isActive
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-4 h-4" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
