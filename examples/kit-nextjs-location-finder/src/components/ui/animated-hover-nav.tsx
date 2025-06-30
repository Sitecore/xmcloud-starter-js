'use client';

import type React from 'react';

import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMatchMedia } from '@/hooks/use-match-media';
import { useContainerQuery } from '@/hooks/use-container-query';
import { cn } from '@/lib/utils';

interface AnimatedHoverNavProps {
  children: ReactNode;
  /**
   * The breakpoint at which to switch from mobile to desktop view
   * Set to null to maintain the same orientation on all screen sizes
   * @default "md"
   */
  mobileBreakpoint?: string | null;
  indicatorClassName?: string;
  accordionView?: ReactNode;
  parentRef: React.RefObject<HTMLDivElement | null>;
  /**
   * When false, horizontal menus will automatically switch to vertical on mobile
   * Has no effect when mobileBreakpoint is null
   * @default false
   */
  disableMobile?: boolean;
  /**
   * The orientation of the navigation menu
   * @default "horizontal"
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Alignment of items in vertical orientation
   * @default "start"
   */
  itemsAlign?: 'start' | 'end' | 'center';
}

export const AnimatedHoverNav = ({
  children,
  mobileBreakpoint = 'md',
  //since this component needs to support underline and full bg button style, we need to set that with className
  indicatorClassName = 'rounded-default bg-secondary h-0-5',
  parentRef,
  disableMobile = false,
  orientation = 'horizontal',
  itemsAlign = 'start',
}: AnimatedHoverNavProps) => {
  // Refs and state for hover effect
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [hoverStyle, setHoverStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  // If mobileBreakpoint is null, always consider it as desktop view
  // This ensures the orientation remains consistent across all screen sizes
  const breakpoint = mobileBreakpoint === null ? 'alwaysDesktop' : mobileBreakpoint;
  const isDesktopQuery = useContainerQuery(parentRef, breakpoint);
  const isDesktop = breakpoint === 'alwaysDesktop' ? true : isDesktopQuery;
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');

  // Determine effective orientation based on screen size and settings
  // If mobileBreakpoint is null, always use the defined orientation
  // Otherwise, if on mobile and disableMobile is false, switch horizontal to vertical
  const effectiveOrientation =
    mobileBreakpoint !== null && !isDesktop && !disableMobile && orientation === 'horizontal'
      ? 'vertical'
      : orientation;

  const isHorizontal = effectiveOrientation === 'horizontal';

  // Handle mouse enter on navigation item
  const handleMouseEnter = useCallback(
    (index: number) => {
      if (mobileBreakpoint !== null && !isDesktop && disableMobile) return;

      const item = itemRefs.current[index];
      const navElement = navRef.current;

      if (item && navElement) {
        const itemRect = item.getBoundingClientRect();
        const navRect = navElement.getBoundingClientRect();

        if (isHorizontal) {
          setHoverStyle({
            left: itemRect.left - navRect.left,
            top: 0,
            width: itemRect.width,
            height: 0,
            opacity: 1,
          });
        } else {
          // For vertical orientation, handle different alignments
          let leftPosition = 0;

          if (itemsAlign === 'end') {
            // For right-aligned items, calculate left position to align with right edge
            leftPosition = navRect.width - itemRect.width;
          } else if (itemsAlign === 'center') {
            // For center-aligned items, calculate left position to center
            leftPosition = (navRect.width - itemRect.width) / 2;
          }

          setHoverStyle({
            left: leftPosition,
            top: itemRect.top - navRect.top,
            width: itemRect.width,
            height: itemRect.height,
            opacity: 1,
          });
        }
      }
    },
    [isDesktop, isHorizontal, disableMobile, mobileBreakpoint, itemsAlign]
  );

  // Handle mouse leave from navigation
  const handleNavMouseLeave = useCallback(() => {
    if (mobileBreakpoint !== null && !isDesktop && disableMobile) return;

    setHoverStyle((prev) => ({
      ...prev,
      opacity: 0,
    }));
  }, [isDesktop, disableMobile, mobileBreakpoint]);

  // Setup refs for child elements
  useEffect(() => {
    if (navRef.current) {
      const listItems = navRef.current.querySelectorAll('li');
      itemRefs.current = Array.from(listItems);
    }
  }, [children, isDesktop]);

  // Add mouse enter event listeners to list items
  useEffect(() => {
    const items = itemRefs.current;

    const handleItemMouseEnter = (index: number) => () => {
      handleMouseEnter(index);
    };

    items.forEach((item, index) => {
      if (item) {
        item.addEventListener('mouseenter', handleItemMouseEnter(index));
      }
    });

    return () => {
      items.forEach((item, index) => {
        if (item) {
          item.removeEventListener('mouseenter', handleItemMouseEnter(index));
        }
      });
    };
  }, [handleMouseEnter, children, isDesktop]);

  // Render with hover effect
  return (
    <div
      ref={navRef}
      onMouseLeave={handleNavMouseLeave}
      className={cn('relative', isHorizontal ? 'flex-row' : 'flex-col')}
    >
      {/* Hover background indicator */}
      <motion.span
        className={`z-1 absolute block ${indicatorClassName}`}
        initial={{ opacity: 0 }}
        animate={
          isHorizontal
            ? {
                left: hoverStyle.left + 4,
                width: hoverStyle.width - 8,
                opacity: hoverStyle.opacity,
              }
            : {
                left: hoverStyle.left + 4,
                top: hoverStyle.top + 4,
                width: hoverStyle.width - 8,
                opacity: hoverStyle.opacity,
              }
        }
        transition={{
          type: 'spring',
          bounce: 0.15,
          duration: isReducedMotion ? 0 : 0.3,
        }}
        // style={isHorizontal ? { height: '100%' } : { width: '100%' }}
      />
      {children}
    </div>
  );
};
