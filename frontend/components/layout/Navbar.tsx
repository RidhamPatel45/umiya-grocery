'use client';

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAuthStore } from '@/store/useAuthStore';
import { useDebounce } from '@/hooks/useDebounce';

// Import Custom ShadCN-like components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

// Categories list
const CATEGORIES = [
  'Pulses & Lentils',
  'Cooking Oils',
  'Flour & Grains',
  'Spices',
  'Dry Fruits',
  'Snacks',
  'Beverages',
  'Household',
];

export function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Hydration safe Cart count
  const cartCount = useCart((s) => s.getTotalItems(), 0);
  const { user, clearAuth, isAdmin } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Sync debounced search query to URL query parameters
  useEffect(() => {
    if (debouncedSearch.trim()) {
      router.push(`/products?search=${encodeURIComponent(debouncedSearch.trim())}`);
    } else if (searchParams.get('search')) {
      router.push('/products');
    }
  }, [debouncedSearch, router, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 shadow-sm backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Umiya Wholesale & Retail Hub Home">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200 transition-transform group-hover:scale-105">
              <span className="text-white font-black text-lg">U</span>
            </div>
            <div className="hidden md:block">
              <p className="font-extrabold text-slate-800 text-base leading-tight tracking-wide">Umiya</p>
              <p className="text-[10px] font-medium text-emerald-600 leading-none uppercase tracking-wider">Wholesale & Retail</p>
            </div>
          </Link>

          {/* Categories Dropdown Menu */}
          <div className="hidden lg:block ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-600 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Browse categories menu">
                Categories
                <span className="text-slate-400 text-xs">▼</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2">
                <DropdownMenuLabel>Product Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {CATEGORIES.map((cat) => (
                  <DropdownMenuItem key={cat} asChild>
                    <Link
                      href={`/category/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                      className="w-full cursor-pointer text-slate-700 hover:text-emerald-600"
                    >
                      {cat}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="flex-1 max-w-lg mx-6 hidden sm:block"
          >
            <div className="relative">
              <label htmlFor="search-input" className="sr-only">Search grocery items</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" aria-hidden="true" />
              <input
                id="search-input"
                type="search"
                placeholder="Search premium groceries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm transition-all"
                aria-label="Search inputs"
              />
            </div>
          </form>

          {/* Right Section Actions */}
          <div className="flex items-center gap-4">
            
            {/* Cart Link with Dynamic Badge */}
            <Link
              href="/cart"
              className="relative p-2.5 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 hover:text-emerald-600"
              aria-label={`Shopping cart, contains ${cartCount} items`}
            >
              <ShoppingCart className="w-6 h-6" aria-hidden="true" />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-bounce"
                  aria-live="polite"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="User account options">
                    <User className="w-6 h-6" aria-hidden="true" />
                    <span className="hidden sm:inline text-sm font-semibold text-slate-700">{user.name.split(' ')[0]}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-52 mt-2">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer">My Orders</Link>
                    </DropdownMenuItem>
                    {isAdmin() && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="text-emerald-600 font-medium cursor-pointer">Admin Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={clearAuth} className="text-rose-600 cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-100"
                aria-label="Log in to your account"
              >
                Login
              </Link>
            )}

            {/* Hamburger menu for Mobile Screen */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger className="p-2 text-slate-700 hover:text-emerald-600 hover:bg-slate-50 rounded-xl focus:outline-none" aria-label="Open navigation sidebar">
                  <Menu className="w-6 h-6" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle className="text-left font-black text-2xl text-emerald-600">Umiya Hub</SheetTitle>
                  </SheetHeader>
                  
                  {/* Mobile Search input */}
                  <div className="mt-6 mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="search"
                        placeholder="Search groceries..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                        aria-label="Search inputs"
                      />
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <nav className="flex flex-col gap-3 mt-6">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Categories</p>
                    <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat}
                          href={`/category/${cat.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                          className="text-sm font-medium text-slate-700 hover:text-emerald-600 py-1.5 transition-colors"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                    
                    <DropdownMenuSeparator className="my-2" />
                    
                    {!user && (
                      <Link
                        href="/login"
                        className="w-full flex items-center justify-center py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-md shadow-emerald-100"
                      >
                        Login
                      </Link>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
