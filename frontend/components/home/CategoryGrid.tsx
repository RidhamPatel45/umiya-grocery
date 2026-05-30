'use client';
import Link from 'next/link';

const categories = [
  { name: 'Pulses & Lentils', slug: 'pulses', emoji: '🫘', color: 'bg-amber-50 border-amber-200' },
  { name: 'Cooking Oils', slug: 'oils', emoji: '🫒', color: 'bg-yellow-50 border-yellow-200' },
  { name: 'Flour & Grains', slug: 'flour-grains', emoji: '🌾', color: 'bg-orange-50 border-orange-200' },
  { name: 'Spices', slug: 'spices', emoji: '🌶️', color: 'bg-red-50 border-red-200' },
  { name: 'Dry Fruits', slug: 'dry-fruits', emoji: '🥜', color: 'bg-green-50 border-green-200' },
  { name: 'Snacks', slug: 'snacks', emoji: '🍿', color: 'bg-purple-50 border-purple-200' },
  { name: 'Beverages', slug: 'beverages', emoji: '☕', color: 'bg-brown-50 border-stone-200' },
  { name: 'Household', slug: 'household', emoji: '🧹', color: 'bg-blue-50 border-blue-200' },
];

export function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📦 Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {categories.map(cat => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${cat.color} hover:shadow-md transition-all duration-200 group`}>
            <span className="text-3xl group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
            <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
