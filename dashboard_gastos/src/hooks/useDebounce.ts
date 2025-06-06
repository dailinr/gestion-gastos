import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Actualiza el valor debounced después del delay especificado
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el timeout si el valor cambia (ej. el usuario sigue escribiendo)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se vuelve a ejecutar si el valor o el delay cambian

  return debouncedValue;
}