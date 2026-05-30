'use client';
import { useEffect, useState } from 'react';
import { cartApi } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    cartApi.get().then(r => setCart(r.data.data)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (itemId: string, qty: number) => {
    await cartApi.update(itemId, qty);
    fetchCart();
  };

  const activeItems = cart?.items?.filter((i: any) => !i.savedForLater) || [];
  const total = activeItems.reduce((sum: number, i: any) => sum + i.product.price * i.quantity, 0);
  const shipping = total > 499 ? 0 : 49;

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-12 text-center">Loading cart...</div>;

  if (!activeItems.length) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 mb-6">Add some groceries to get started</p>
      <Link href="/products" className="btn-primary">Browse Products</Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart ({activeItems.length} items)</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-3">
          {activeItems.map((item: any) => (
            <div key={item._id} className="card p-4 flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image src={item.product.images?.[0] || ''} alt={item.product.name} fill className="object-contain rounded-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm">{item.product.name}</h3>
                <p className="text-xs text-gray-400">{item.product.weight}</p>
                <p className="font-bold text-primary-600 mt-1">₹{item.product.price}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item._id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item._id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center transition-colors">
                    <Plus className="w-3 h-3 text-primary-600" />
                  </button>
                </div>
                <p className="text-sm font-bold">₹{item.product.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="card p-5 sticky top-20">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{total}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
              {shipping > 0 && <p className="text-xs text-gray-400">Add ₹{499 - total} more for free delivery</p>}
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg mb-4">
              <span>Total</span><span>₹{total + shipping}</span>
            </div>
            <Link href="/checkout" className="btn-primary w-full text-center block">Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
