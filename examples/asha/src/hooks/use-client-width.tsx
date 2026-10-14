'use client';

import { useEffect, useState, type RefObject } from 'react';

type WidthTransformFn = (width: number) => number;

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
