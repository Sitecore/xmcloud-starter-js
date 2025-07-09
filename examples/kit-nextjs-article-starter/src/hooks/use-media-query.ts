'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Default to true if prefers-reduced-motion is the query and we're in SSR
    if (typeof window === 'undefined' && query === '(prefers-reduced-motion: reduce)') {
      setMatches(true);
      return;
    }

    const media = window.matchMedia(query);

    // Initial check
    setMatches(media.matches);

    // Setup listener for changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
