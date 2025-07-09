'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState, useRef } from 'react';

interface MeteorsProps {
  number?: number;
  minDelay?: number;
  maxDelay?: number;
  minDuration?: number;
  maxDuration?: number;
  angle?: number;
  className?: string;
  color?: string;
  size?: string;
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
  size = '1',
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<Array<React.CSSProperties>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to generate meteor styles based on container width
    const generateStyles = () => {
      const containerWidth = containerRef.current?.offsetWidth || window.innerWidth;

      const styles = [...new Array(number)].map(() => ({
        '--angle': angle + 'deg',
        top: -5,
        // Distribute across the full width of the container
        left: `${Math.floor(Math.random() * containerWidth)}px`,
        animationDelay: Math.random() * (maxDelay - minDelay) + minDelay + 's',
        animationDuration:
          Math.floor(Math.random() * (maxDuration - minDuration) + minDuration) + 's',
      }));
      setMeteorStyles(styles);
    };

    // Generate initial styles
    generateStyles();

    // Add resize event listener to update meteors when window resizes
    window.addEventListener('resize', generateStyles);
    return () => {
      window.removeEventListener('resize', generateStyles);
    };
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          style={{
            ...style,
            // Use CSS variable if provided, fallback to white
            backgroundColor: `rgba(var(--meteor-color, 255, 255, 255), var(--meteor-opacity, 1))`,
            width: `${size}px`,
            height: `${size}px`,
            animation: `${style.animationDuration} linear ${style.animationDelay} infinite`,
            opacity: 1,
            position: 'absolute',
            pointerEvents: 'none',
            transform: `rotate(${angle}deg)`,
            borderRadius: '9999px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
            animationName: 'meteorAnimation',
          }}
          className={cn(
            'pointer-events-none absolute rotate-[var(--angle)] rounded-full shadow-[0_0_0_1px_rgba(255,255,255,0.1)]',
            className
          )}
        >
          {/* Meteor Tail */}
          <div
            className="pointer-events-none absolute top-1/2 -z-10 -translate-y-1/2"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(var(--meteor-color, 255, 255, 255), var(--meteor-opacity, 1)), transparent)`,
              height: `${Math.max(1, parseInt(size) / 2)}px`,
              width: '100px',
            }}
          />
        </span>
      ))}
      <style jsx global>{`
        @keyframes meteorAnimation {
          0% {
            transform: rotate(${angle}deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: rotate(${angle}deg) translateX(-500px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
