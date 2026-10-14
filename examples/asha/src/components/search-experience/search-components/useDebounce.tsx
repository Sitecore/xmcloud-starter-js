'use client';
import { useCallback, useRef } from 'react';
import { DEBOUNCE_TIME } from './constants';

/**
 * This hook is used to debounce a callback.
 */
export const useDebouncedCallback = <T extends unknown[]>(
  cb: (...args: T) => void,
  delay: number = DEBOUNCE_TIME
) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    (...args: T) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => cb(...args), delay);
    },
    [cb, delay]
  );
};
