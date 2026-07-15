import type { ImageField, Page } from '@sitecore-content-sdk/nextjs';

/** Props for the ImageWrapper presentation component (not a Sitecore layout component). */
export type ImageWrapperProps = {
  image?: ImageField;
  page?: Page;
  className?: string;
  priority?: boolean;
  sizes?: string;
  blurDataURL?: string;
  alt?: string;
  wrapperClass?: string;
  [key: string]: unknown;
};
