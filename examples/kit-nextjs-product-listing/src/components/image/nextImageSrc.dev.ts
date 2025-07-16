import { ImageField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { getImageProps } from 'next/image';

const getImageUrl = (imageField: ImageField) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { page } = useSitecore();
  const { mode } = page;
  const src = imageField?.value?.src;

  if (!mode.isNormal && src?.startsWith('/')) {
    return `${window.location.protocol}//${window.location.hostname}${src}`;
  }

  return src ? `${src.replace('http://cm/', '/')}` : '';
};

export const nextImageSrc = (img: ImageField) =>
  getImageProps({
    alt: (img.value as { alt: string }).alt,
    width: (img.value as { width: number }).width,
    height: (img.value as { height: number }).height,
    src: getImageUrl(img),
  })?.props?.src;
