'use client';
import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cartCount = useCartStore(s => s.getCount());
  const { user, clearAuth, isAdmin } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-gray-900 text-sm leading-tight">Umiya</p>
              <p className="text-xs text-gray-500 leading-tight">Wholesale & Retail Hub</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search groceries..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 hidden group-hover:block z-50">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Orders</Link>
                  {isAdmin() && <Link href="/admin" className="block px-4 py-2 text-sm text-primary-600 hover:bg-gray-50">Admin Dashboard</Link>}
                  <button onClick={clearAuth} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm hidden sm:block">Login</Link>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100 mt-1 pt-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search groceries..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm" />
            </div>
            <nav className="flex flex-col gap-1">
              <Link href="/products" className="text-sm text-gray-700 py-2 hover:text-primary-600">All Products</Link>
              <Link href="/categories" className="text-sm text-gray-700 py-2 hover:text-primary-600">Categories</Link>
              {!user && <Link href="/login" className="btn-primary text-center mt-2">Login</Link>}
            </nav>
          </div>
        )}
      </div>

      {/* Category Nav */}
      <nav className="bg-primary-600 hidden md:block">
        <div className="max-w-7xl mx-auto px-8 flex gap-6 overflow-x-auto">
          {['Pulses & Lentils', 'Cooking Oils', 'Flour & Grains', 'Spices', 'Dry Fruits', 'Snacks', 'Beverages', 'Household'].map(cat => (
            <Link key={cat} href={`/category/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
              className="text-white/90 hover:text-white text-xs font-medium py-2.5 whitespace-nowrap hover:bg-white/10 px-2 rounded transition-colors">
              {cat}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
