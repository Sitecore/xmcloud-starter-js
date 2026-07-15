export type AnimationType = 'slide' | 'rotate';
export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

export type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  direction?: AnimationDirection;
  distanceInRem?: number;
  delay?: number;
  duration?: number;
  animationType?: AnimationType;
  endRotation?: number;
  divWithImage?: React.RefObject<HTMLDivElement | null>;
  threshold?: number;
  reducedMotion?: boolean;
  isPageEditing?: boolean;
};
