'use client';

import { useEffect, useState, type RefObject } from 'react';
import { breakpoints } from '@/enumerations/containerQuery.enum';
// Define the breakpoint sizes that match Tailwind's container query breakpoints

export const containerBreakpoints = { ...breakpoints } as const;

export type ContainerBreakpoint = keyof typeof containerBreakpoints;

/**
 * A hook that determines if a container element matches a specified breakpoint
 *
 * @param containerRef - Reference to the container element to observe
 * @param breakpoint - The breakpoint to check against (sm, md, lg, xl, 2xl)
 * @param direction - Whether to check if the container is "min" (>=) or "max" (<) the breakpoint
 * @returns Boolean indicating if the container matches the breakpoint condition
 */
export function useContainerQuery(
  containerRef: RefObject<HTMLElement | null>,
  breakpoint: ContainerBreakpoint,
  direction: 'min' | 'max' = 'min'
): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const container = containerRef?.current;
    if (!container) return;

    const breakpointSize = containerBreakpoints[breakpoint];

    // Create a function to check if the container matches the breakpoint
    const checkContainer = (width: number) => {
      if (direction === 'min') {
        setMatches(width >= breakpointSize);
      } else {
        setMatches(width < breakpointSize);
      }
    };
    // Initialize with the current size
    checkContainer(container.clientWidth);

    // Set up ResizeObserver to watch for container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        checkContainer(width);
      }
    });

    resizeObserver.observe(container);

    // Clean up the observer when the component unmounts
    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, breakpoint, direction]);

  return matches;
}
