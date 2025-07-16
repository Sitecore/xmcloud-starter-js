'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { MediaSectionProps } from './media-section.props';
import { useSitecore, ImageField } from '@sitecore-content-sdk/nextjs';
import { getImageProps } from 'next/image';
import { cn } from '@/lib/utils';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

declare module 'react' {
  interface VideoHTMLAttributes<T> extends React.HTMLProps<T> {
    loading?: 'lazy' | 'eager';
  }
}
export const Default = ({
  video,
  image,
  className = '',
  pause,
  reducedMotion,
}: MediaSectionProps) => {
  const [isIntersecting, elementRef] = useIntersectionObserver({
    threshold: 0.3,
    unobserveAfterVisible: false,
  });

  const [imgSrc, setImgSrc] = useState({ src: '', width: 0, height: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  const { page } = useSitecore();
  const getImageUrl = useCallback(
    (imageField: ImageField) => {
      const src = imageField?.value?.src;
      if (!page.mode.isNormal && src?.startsWith('/')) {
        return `${window.location.protocol}//${window.location.hostname}${src}`;
      }

      return src ? `${src.replace('http://cm/', '/')}` : '';
    },
    [page]
  );
  useEffect(() => {
    if (!elementRef.current) return;
    const vidEl = elementRef?.current?.querySelector('video');
    if (pause) {
      vidEl?.pause();
    } else {
      if (isIntersecting) {
        vidEl?.play().catch(() => {
          // Handle autoplay failure silently
        });
      } else {
        vidEl?.pause();
      }
    }
    if (image) {
      setImgSrc({
        src: getImageProps({
          alt: '',
          width: (image.value?.width ? image.value?.width : 128) as number,
          height: (image.value?.height ? image.value?.height : 128) as number,
          src: getImageUrl(image),
        })?.props?.src,
        width: image.value?.width as number,
        height: image.value?.height as number,
      });
    }
    if (pause) {
      vidEl?.pause();
    } else {
      if (isIntersecting) {
        vidEl?.play().catch(() => {
          // Handle autoplay failure silently
        });
      } else {
        vidEl?.pause();
      }
    }
  }, [image, isIntersecting, page, getImageUrl, pause, elementRef]);

  if (!video && !image) return null;

  return (
    <div className={`relative ${className}  `} ref={elementRef}>
      {!reducedMotion && video && (
        //preload meta but lazy load the video
        <video
          //   style={{ height: `${imgSrc.height}px`, width: `${imgSrc.width}px` }}
          ref={videoRef}
          className={cn(
            '@lg:rounded-default inset-0 block h-full w-full rounded-md object-cover',
            className
          )}
          playsInline
          muted
          loop
          aria-hidden="true"
          poster={imgSrc.src}
          preload="metadata"
          loading="lazy"
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
      {(reducedMotion && image) || (!video && image) ? (
        <ImageWrapper
          image={image}
          className={cn(
            '@lg:rounded-default inset-0 block h-full w-full rounded-md object-cover',
            className
          )}
          alt=""
        />
      ) : null}
    </div>
  );
};
