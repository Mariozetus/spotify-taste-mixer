import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Establecer un timer para actualizar el valor después del delay
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Limpiar el timer si el valor cambia antes de que expire el delay
        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
