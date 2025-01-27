import { useState, useEffect } from 'react';

const useDebounce = <T>(
  value: T,
  delay: number = 500,
): [T, React.Dispatch<T>] => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, setDebouncedValue];
};

export default useDebounce;
