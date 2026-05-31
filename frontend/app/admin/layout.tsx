// app/admin/layout.tsx
import { ReactNode } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Header from '@/components/admin/Header';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-gray-200 md:bg-white">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="fixed top-4 left-4 md:hidden p-2 rounded-md bg-white shadow-md">
            <Menu className="w-5 h-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
