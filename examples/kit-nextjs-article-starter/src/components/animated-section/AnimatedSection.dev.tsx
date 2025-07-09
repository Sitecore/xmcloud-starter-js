import React, { useMemo } from 'react';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

type AnimationType = 'slide' | 'rotate';
type Direction = 'up' | 'down' | 'left' | 'right';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  animationType?: AnimationType;
  endRotation?: number;
  divWithImage?: React.RefObject<HTMLDivElement | null>;
  reducedMotion?: boolean;
  isPageEditing?: boolean;
}

interface StyleObject {
  [key: string]: string | number;
}

export const Default: React.FC<AnimatedSectionProps> = React.memo(
  ({
    children,
    className = '',
    direction = 'up',
    delay = 0,
    duration = 1000,
    animationType = 'slide',
    endRotation = 180,
    reducedMotion = false,
    isPageEditing = false,
  }) => {
    const [isVisible, ref] = useIntersectionObserver({
      threshold: 0.3,
    });

    const directionStyles = useMemo(
      () => ({
        up: { '--translate-x': '0', '--translate-y': '2rem' },
        down: { '--translate-x': '0', '--translate-y': '-2rem' },
        left: { '--translate-x': '2rem', '--translate-y': '0' },
        right: { '--translate-x': '-2rem', '--translate-y': '0' },
      }),
      []
    );

    const styles: StyleObject = useMemo<StyleObject>(() => {
      if (animationType === 'rotate') {
        return {
          transform: isVisible || isPageEditing ? `rotate(${endRotation}deg)` : `rotate(0deg)`,
          transition:
            reducedMotion || isPageEditing
              ? 'none'
              : `transform ${duration}ms ${delay}ms ease-in-out`,
        };
      }
      // default: slide
      return {
        ...directionStyles[direction],
        transform:
          isVisible || isPageEditing
            ? 'translate(0, 0)'
            : `translate(var(--translate-x), var(--translate-y))`,
        transition:
          reducedMotion || isPageEditing
            ? 'none'
            : `opacity ${duration}ms ${delay}ms ease-out, transform ${duration}ms ${delay}ms ease-out`,
        opacity: reducedMotion || isVisible ? 1 : 0,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPageEditing, isVisible, reducedMotion]);

    return (
      <div ref={ref} className={className} style={styles}>
        {children}
      </div>
    );
  }
);

Default.displayName = 'AnimatedSection';
