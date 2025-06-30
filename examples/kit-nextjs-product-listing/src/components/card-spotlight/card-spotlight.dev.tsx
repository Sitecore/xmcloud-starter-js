'use client';

import { useMotionValue, motion, useMotionTemplate } from 'motion/react';
import type React from 'react';
import { type MouseEvent as ReactMouseEvent, useState, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

export const CardSpotlight = ({
  children,
  radius = 350,
  color = 'rgba(255, 255, 255, 0.1)',
  prefersReducedMotion = false,
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  prefersReducedMotion?: boolean;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  // Always call hooks regardless of prefersReducedMotion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Call useMotionTemplate unconditionally
  const maskImage = useMotionTemplate`
    radial-gradient(
      ${radius}px circle at ${mouseX}px ${mouseY}px,
      white,
      transparent 80%
    )
  `;

  // Event handlers that actually use the state
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Determine if spotlight should be visible
  // Memoize the spotlight visibility calculation to prevent unnecessary recalculations
  const isSpotlightVisible = useMemo(() => {
    return !prefersReducedMotion && (isHovering || isFocused);
  }, [prefersReducedMotion, isHovering, isFocused]);

  const handleMouseMove = useCallback(
    ({ currentTarget, clientX, clientY }: ReactMouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !isSpotlightVisible) return;
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [prefersReducedMotion, mouseX, mouseY, isSpotlightVisible]
  );
  return (
    <div
      className={cn(
        'rounded-default duration-400 bg-secondary group relative h-full self-stretch transition-all',
        { spotlight: isSpotlightVisible },

        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      {...props}
      data-component="CardSpotlight"
    >
      {/* Spotlight effect - controlled by state instead of CSS classes */}
      {!prefersReducedMotion && (
        <motion.div
          className="pointer-events-none absolute -inset-px z-0 transition duration-300"
          style={{
            backgroundColor: color,
            maskImage,
            opacity: isSpotlightVisible ? 1 : 0,
          }}
        />
      )}

      {/* Semi-transparent overlay to improve text contrast */}
      {/* Wrapper for children with increased contrast when spotlight is active */}
      <div className="relative z-[2] flex h-full  w-full transition-all duration-300">
        {children}
      </div>
    </div>
  );
};
