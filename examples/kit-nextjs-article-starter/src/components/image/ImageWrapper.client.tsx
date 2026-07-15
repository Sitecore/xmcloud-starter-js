'use client';

import { useContext, useEffect, useState } from 'react';
import { useRef } from 'react';
import type React from 'react';
import { cn } from '@/lib/utils';
import { ImageField, Image as ContentSdkImage, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ImageOptimizationContext } from '@/components/image/image-optimization.context';
import { useInView } from 'framer-motion';
import NextImage, { ImageProps } from 'next/image';
import placeholderImageLoader from '@/utils/placeholderImageLoader';

/**
 * Returns true if the URL is from a host allowed by Next.js remotePatterns (see next.config).
 * These hosts can be optimized by the Next.js Image Optimization API.
 */
function isAllowedRemoteImageHost(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return (
      /^edge/.test(hostname) ||
      /^xmc-/.test(hostname) ||
      hostname.endsWith('.sitecore-staging.cloud') ||
      hostname.endsWith('.sitecorecloud.io')
    );
  } catch {
    return false;
  }
}

export type ImageWrapperProps = {
  image?: ImageField;
  className?: string;
  priority?: boolean;
  sizes?: string;
  blurDataURL?: string;
  alt?: string;
  wrapperClass?: string;
  emptyFieldEditingComponent?: React.ComponentType<{ className?: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

function isRealAuthorMediaSrc(src: string | undefined | null): boolean {
  if (src == null || typeof src !== 'string') return false;
  const s = src.trim();
  if (!s) return false;
  if (s.startsWith('data:')) return false;
  if (s.startsWith('blob:')) return false;
  return true;
}

function fieldForSdkWithCustomEmpty(field: ImageField | undefined): ImageField | undefined {
  if (!field) return field;
  if (isRealAuthorMediaSrc(field.value?.src)) return field;
  return { ...field, value: {} as ImageField['value'] };
}

export const ImageWrapperClient: React.FC<ImageWrapperProps> = (props) => {
  const { image, className, wrapperClass, sizes, emptyFieldEditingComponent, ...rest } = props;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;
  const isPreview = page?.mode.isPreview;
  const isDesignLibrary = page.mode.isDesignLibrary;

  const { unoptimized } = useContext(ImageOptimizationContext);
  const ref = useRef(null);
  const inView = useInView(ref);

  // State to track if we're on client-side after hydration
  const [isClient, setIsClient] = useState(false);

  // Only run on client after hydration is complete
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isPageEditing && !isPreview && !isDesignLibrary && !image?.value?.src) {
    return <></>;
  }

  const imageSrc = image?.value?.src ? image?.value?.src : '';
  const isSvg = imageSrc.includes('.svg');
  const shouldRenderCustomEmptyEditingImage =
    Boolean(emptyFieldEditingComponent) && !isRealAuthorMediaSrc(imageSrc);
  // Only disable optimization for: context override, SVG, or external URLs not in remotePatterns.
  // Sitecore/XM Cloud URLs (edge*, xmc-*, *.sitecore-staging.cloud, *.sitecorecloud.io) are
  // allowed in next.config and should be optimized to fix Lighthouse "Improve image delivery".
  const isExternalNotAllowed =
    imageSrc.startsWith('https://') &&
    isClient &&
    !imageSrc.includes(window.location.hostname) &&
    !isAllowedRemoteImageHost(imageSrc);
  const isUnoptimized = unoptimized || isSvg || isExternalNotAllowed;

  const isPicsumImage = imageSrc.includes('picsum.photos');
  const EmptyFieldEditingComponent = emptyFieldEditingComponent;

  return (
    <div className={cn('image-container', wrapperClass)}>
      {isPageEditing || isPreview || isSvg || isDesignLibrary ? (
        shouldRenderCustomEmptyEditingImage && EmptyFieldEditingComponent ? (
          <EmptyFieldEditingComponent className={className} />
        ) : (
          <ContentSdkImage
            field={emptyFieldEditingComponent ? fieldForSdkWithCustomEmpty(image) : image}
            className={className}
          />
        )
      ) : (
        <NextImage
          loader={isPicsumImage ? placeholderImageLoader : undefined}
          {...(image?.value as ImageProps)}
          className={className}
          unoptimized={isUnoptimized}
          priority={inView ? true : false}
          // Always use sizes for responsive images (except SVG which doesn't need it)
          // If sizes not provided, use a sensible default for full-width images
          sizes={
            isSvg
              ? undefined
              : sizes ||
                '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 1200px'
          }
          blurDataURL={image?.value?.src}
          placeholder="blur"
          //if image is an svg and no width is provide, set a default to avoid error, this will be overwritten by css
          {...(!image?.value?.width && isSvg ? { width: 16, height: 16 } : {})}
          {...rest}
        />
      )}
    </div>
  );
};
