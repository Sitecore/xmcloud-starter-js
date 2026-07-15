import { ImageField, Page } from '@sitecore-content-sdk/nextjs';
import { getImageProps } from 'next/image';
import { isBrowser } from '@/utils/browser';

const getImageUrl = (imageField: ImageField, page: Page) => {
  const { mode } = page;
  const src = imageField?.value?.src;

  if (!mode.isNormal && isBrowser && src?.startsWith('/')) {
    return `${window.location.protocol}//${window.location.hostname}${src}`;
  }

  return src ? `${src.replace('http://cm/', '/')}` : '';
};

export const nextImageSrc = (img: ImageField, page: Page) =>
  getImageProps({
    alt: (img.value as { alt: string }).alt,
    width: (img.value as { width: number }).width,
    height: (img.value as { height: number }).height,
    src: getImageUrl(img, page),
  })?.props?.src;
