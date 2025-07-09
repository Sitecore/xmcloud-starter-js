import { ImageField } from '@sitecore-content-sdk/nextjs';

export interface MediaSectionProps {
  video?: string;
  image?: ImageField;
  priority?: boolean;
  className?: string;
  height?: number;
  width?: number;
  pause: boolean;
  reducedMotion: boolean;
}
