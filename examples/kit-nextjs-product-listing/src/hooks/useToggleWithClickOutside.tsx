'use client';

import { useState, useEffect, useRef, RefObject } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function useToggleWithClickOutside<T extends HTMLElement = HTMLElement>(
  initialVisible = false
): {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  ref: RefObject<T | null>;
} {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const ref = useRef<T | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isVisible) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible]);

  // Close the menu when the route changes (pathname or search params)
  useEffect(() => {
    setIsVisible(false);
  }, [pathname, searchParams]);

  return { isVisible, setIsVisible, ref };
}
