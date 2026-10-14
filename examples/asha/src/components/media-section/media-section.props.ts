import { ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export interface MediaSectionProps extends ComponentProps {
  video?: string;
  image?: ImageField;
  priority?: boolean;
  className?: string;
  height?: number;
  width?: number;
  pause: boolean;
  reducedMotion: boolean;
}
