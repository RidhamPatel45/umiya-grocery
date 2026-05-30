'use client';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            🎉 Free delivery above ₹499
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
            Fresh Groceries<br />
            <span className="text-yellow-300">At Wholesale Prices</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-lg">
            Shop from 1000+ products — pulses, oils, flour, spices, dry fruits and more.
            Delivered fresh to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/products" className="bg-white text-primary-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors text-center">
              Shop Now
            </Link>
            <Link href="/categories" className="border-2 border-white/50 text-white font-semibold px-8 py-3 rounded-xl hover:border-white transition-colors text-center">
              Browse Categories
            </Link>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
            <div className="relative grid grid-cols-2 gap-3 p-6">
              {['🫘', '🫒', '🌾', '🌶️'].map((emoji, i) => (
                <div key={i} className="bg-white/20 backdrop-blur rounded-2xl p-6 flex items-center justify-center text-4xl">
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
