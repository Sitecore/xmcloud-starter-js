'use client';

import { useEffect, useRef, type RefObject, useCallback } from 'react';
import { useMatchMedia } from '@/hooks/use-match-media';

interface UseParallaxOptions {
  disabled?: boolean;
  selector?: string;
  backgroundSelector?: string;
  foregroundSelector?: string;
  throttleMs?: number; // Added throttle option
}

/**
 * Enhanced parallax effect hook with performance optimizations
 */
export function useParallaxEnhancedOptimized(
  containerRef: RefObject<HTMLElement | null>,
  options: UseParallaxOptions = {}
) {
  const {
    disabled = false,
    selector = '.parallax-element',
    backgroundSelector = '.parallax-background',
    foregroundSelector = '.parallax-foreground',
    throttleMs = 16, // ~60fps
  } = options;

  // Check for reduced motion preference
  const prefersReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');

  // Store elements in a ref to avoid re-querying the DOM
  const elementsRef = useRef<{
    standard: HTMLElement[];
    background: HTMLElement[];
    foreground: HTMLElement[];
  }>({ standard: [], background: [], foreground: [] });

  // Store last scroll position to optimize calculations
  const lastScrollY = useRef(0);

  // Store animation frame ID for cleanup
  const animationFrameId = useRef<number | null>(null);

  // Store throttle timer
  const throttleTimer = useRef<number | null>(null);

  // Memoize the scroll handler to prevent recreating on each render
  const handleScroll = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    // Use requestAnimationFrame for smoother animations
    animationFrameId.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;

      const currentScrollY = window.scrollY;

      // Skip if scroll position hasn't changed significantly
      if (Math.abs(currentScrollY - lastScrollY.current) < 2) return;

      lastScrollY.current = currentScrollY;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerTop = currentScrollY + containerRect.top;
      const containerHeight = containerRect.height;
      const windowHeight = window.innerHeight;

      // Only process if container is in viewport
      if (
        currentScrollY + windowHeight < containerTop ||
        currentScrollY > containerTop + containerHeight
      )
        return;

      // Calculate how far into the section we've scrolled (0 to 1)
      const scrollProgress = Math.max(
        0,
        Math.min(
          1,
          (currentScrollY - containerTop + windowHeight) / (containerHeight + windowHeight)
        )
      );

      // Apply transforms to standard elements
      elementsRef.current.standard.forEach((element) => {
        const speed = Number.parseFloat(element.getAttribute('data-speed') || '0.1');
        const yPos = (currentScrollY - containerTop) * speed;

        // Use transform3d for hardware acceleration
        element.style.transform = `translate3d(0, ${yPos}px, 0)`;
      });

      // Apply transforms to background elements
      elementsRef.current.background.forEach((element) => {
        const scale = 1 + scrollProgress * 0.1;
        const opacity = Math.max(0.2, 1 - scrollProgress * 0.8);
        const yPos = scrollProgress * -50;

        element.style.transform = `translate3d(0, ${yPos}px, 0) scale(${scale})`;
        element.style.opacity = `${opacity}`;
      });

      // Apply transforms to foreground elements
      elementsRef.current.foreground.forEach((element) => {
        const yPos = scrollProgress * 100;
        const scale = 1 - scrollProgress * 0.05;

        element.style.transform = `translate3d(0, ${yPos}px, 0) scale(${scale})`;
      });
    });
  }, [containerRef]);

  // Throttled scroll handler
  const throttledScrollHandler = useCallback(() => {
    if (throttleTimer.current === null) {
      throttleTimer.current = window.setTimeout(() => {
        handleScroll();
        throttleTimer.current = null;
      }, throttleMs);
    }
  }, [handleScroll, throttleMs]);

  // Cache DOM elements and set up scroll listener
  useEffect(() => {
    // If disabled or reduced motion, don't apply parallax
    if (disabled || prefersReducedMotion || !containerRef.current) return;

    // Cache DOM elements on mount to avoid repeated queries
    const container = containerRef.current;
    elementsRef.current = {
      standard: Array.from(container.querySelectorAll(selector)) as HTMLElement[],
      background: Array.from(container.querySelectorAll(backgroundSelector)) as HTMLElement[],
      foreground: Array.from(container.querySelectorAll(foregroundSelector)) as HTMLElement[],
    };

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    // Initialize positions
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      if (throttleTimer.current) {
        clearTimeout(throttleTimer.current);
      }
    };
  }, [
    containerRef,
    disabled,
    selector,
    backgroundSelector,
    foregroundSelector,
    prefersReducedMotion,
    handleScroll,
    throttledScrollHandler,
  ]);

  // Return whether parallax is active
  return { isParallaxActive: !disabled && !prefersReducedMotion };
}
