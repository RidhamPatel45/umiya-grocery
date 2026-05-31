import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Umiya Wholesale & Retail Hub | Online Grocery Store',
  description: 'Your one-stop shop for wholesale and retail groceries. Best prices on pulses, oils, flour, spices, and more.',
  keywords: 'grocery, wholesale, retail, pulses, oils, flour, spices, Ahmedabad',
  openGraph: {
    title: 'Umiya Grocery',
    description: 'Shop groceries online at best prices',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 min-h-screen flex flex-col`}>
        <Suspense fallback={<div className="h-16 bg-white border-b" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
