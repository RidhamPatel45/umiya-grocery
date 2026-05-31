import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any value changes.
 * Used to delay search queries and prevent excessive API calls while the user is typing.
 * 
 * @param value The value to debounce
 * @param delay The delay in milliseconds
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up timeout on value changes or unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
