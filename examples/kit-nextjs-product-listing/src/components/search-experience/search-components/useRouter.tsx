'use client';
import { useCallback } from 'react';
import { useRouter as useNextRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from './useDebounce';

export const useRouter = () => {
  const router = useNextRouter();
  const pathname = usePathname();
  const setRouterQuery = useCallback(
    (value: string) => {
      // Construct the URL with current pathname to avoid exposing rewrites
      const currentPath = pathname.split('?')[0];
      const queryString = value ? `?q=${value}` : '';
      const asPath = currentPath + queryString;

      router.replace(asPath);
    },
    [router, pathname]
  );

  const debouncedSetRouterQuery = useDebouncedCallback(setRouterQuery);

  const setQuery = useCallback(
    (value: string, debounced: boolean = true) => {
      if (debounced) {
        debouncedSetRouterQuery(value);
      } else {
        setRouterQuery(value);
      }
    },
    [debouncedSetRouterQuery, setRouterQuery]
  );

  return { setRouterQuery: setQuery };
};
