import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// TypeScript Interface for Cart Item
export interface CartItem {
  _id: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
  quantity: number;
}

// TypeScript Interface for Cart Store actions and state
export interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

// Persisted Zustand Cart Store
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i._id === item._id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > item.stock) {
            // Do not allow exceeding available stock
            return;
          }
          set({
            items: currentItems.map((i) =>
              i._id === item._id ? { ...i, quantity: newQuantity } : i
            ),
          });
        } else {
          if (quantity > item.stock) {
            return;
          }
          set({ items: [...currentItems, { ...item, quantity }] });
        }
      },
      removeItem: (itemId) => {
        set({
          items: get().items.filter((item) => item._id !== itemId),
        });
      },
      updateQuantity: (itemId, quantity) => {
        const currentItems = get().items;
        const item = currentItems.find((i) => i._id === itemId);
        if (!item || quantity < 1 || quantity > item.stock) return;

        set({
          items: currentItems.map((i) =>
            i._id === itemId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'umiya-shopping-cart', // Unique localStorage key
    }
  )
);
export default useCartStore;
