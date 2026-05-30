import { create } from 'zustand';

interface CartItem {
  _id: string;
  product: { _id: string; name: string; price: number; images: string[]; weight: string; stock: number };
  quantity: number;
}

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  getTotal: () => get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  getCount: () => get().items.reduce((count, item) => count + item.quantity, 0),
}));
