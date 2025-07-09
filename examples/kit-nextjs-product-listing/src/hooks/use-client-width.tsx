'use client';

import { useEffect, useState, type RefObject } from 'react';

type WidthTransformFn = (width: number) => number;

/**
 * Hook that returns the client width of an element using a ref.
 * Updates when the window is resized.
 *
 * @param ref - React ref object pointing to an HTML element
 * @param transformWidth - Optional function to transform the width value (e.g., set max width)
 * @returns The client width of the element in pixels, optionally transformed
 */
export function useClientWidth<T extends HTMLElement>(
  ref: RefObject<T | null>,
  transformWidth?: WidthTransformFn
): number {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    if (!ref.current) return;

    const updateWidth = () => {
      if (ref.current) {
        const rawWidth = ref.current.clientWidth;
        const finalWidth = transformWidth ? transformWidth(rawWidth) : rawWidth;
        setWidth(finalWidth);
      }
    };

    // Set initial width
    updateWidth();

    // Update width on resize
    window.addEventListener('resize', updateWidth);

    // Clean up event listener
    return () => window.removeEventListener('resize', updateWidth);
  }, [ref, transformWidth]);

  return width;
}
