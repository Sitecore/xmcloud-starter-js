type AnimationType = 'slide' | 'rotate';
type Direction = 'up' | 'down' | 'left' | 'right';

export interface AnimatedSectionProps {
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

export interface StyleObject {
  [key: string]: string | number;
}
