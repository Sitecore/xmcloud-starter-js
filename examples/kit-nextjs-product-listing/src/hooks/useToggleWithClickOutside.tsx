import { useState, useEffect, useRef, RefObject } from 'react';
import { useRouter } from 'next/router';

export function useToggleWithClickOutside<T extends HTMLElement = HTMLElement>(
  initialVisible = false
): {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  ref: RefObject<T | null>;
} {
  const [isVisible, setIsVisible] = useState(initialVisible);
  const ref = useRef<T | null>(null);
  const router = useRouter();

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

    function handleRouteChange() {
      setIsVisible(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [isVisible, router.events]);

  return { isVisible, setIsVisible, ref };
}
