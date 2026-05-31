import { useState, useEffect } from 'react';
import { useCartStore, CartStore } from '../store/useCartStore';

/**
 * A custom hook wrapping the persisted useCartStore to prevent SSR hydration mismatch errors.
 * Returns the selected state value after mounting on the client, or the fallback value while rendering on the server.
 * 
 * @param selector Function to select state from the store
 * @param fallback Fallback value returned during SSR before client-side hydration
 */
export function useCart<T>(selector: (state: CartStore) => T, fallback: T): T {
  const [isHydrated, setIsHydrated] = useState(false);
  const storeValue = useCartStore(selector);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? storeValue : fallback;
}

export default useCart;
