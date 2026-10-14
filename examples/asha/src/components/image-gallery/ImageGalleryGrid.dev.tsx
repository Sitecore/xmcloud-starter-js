'use client';

import type React from 'react';
import { useRef } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { ImageGalleryProps } from './image-gallery.props';
import { useParallaxEnhancedOptimized } from '@/hooks/use-parallax-enhanced-optimized';
import { useMatchMedia } from '@/hooks/use-match-media';
import { cn } from '@/lib/utils';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { useContainerQuery } from '@/hooks/use-container-query';

export const ImageGalleryGrid: React.FC<ImageGalleryProps> = (props) => {
  const { fields, isPageEditing } = props;
  const prefersReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const containerRef = useRef<HTMLDivElement>(null);
  const { title, description, image1, image2, image3, image4 } = fields || {};

  // Use our enhanced parallax hook with reduced motion check
  const { isParallaxActive } = useParallaxEnhancedOptimized(containerRef, {
    disabled: isPageEditing || prefersReducedMotion,
  });
  const isMdContainer = useContainerQuery(containerRef, 'md', 'max');

  if (fields) {
    return (
      <div
        ref={containerRef}
        className={cn(
          '@container relative min-h-[100vh] max-w-screen-xl transform-gpu overflow-hidden px-4 py-16',
          {
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
        data-class-change
      >
        {/* Accessibility notice for motion preferences */}
        {prefersReducedMotion && (
          <div className="sr-only" aria-live="polite">
            Parallax effects have been disabled due to your reduced motion preference.
          </div>
        )}

        <div className="@md:py-10 relative mx-auto mb-16 max-w-6xl py-0">
          {/* Centered header section */}
          <div className="mb-16 text-center">
            <div
              className={`${isParallaxActive ? 'parallax-element' : ''}`}
              data-speed={isMdContainer ? '-0.2' : '-0.03'}
            >
              {title && <Text tag="h2" field={title} />}
            </div>
            <div
              className={`mx-auto max-w-2xl ${isParallaxActive ? 'parallax-element' : ''}`}
              data-speed={isMdContainer ? '-0.15' : '-0.01'}
            >
              {description && <Text tag="p" className="text-xl" field={description} />}
            </div>
          </div>
          {/* 2x2 Grid layout */}
          <div className="@md:grid-cols-2 @md:gap-6 grid grid-cols-1 gap-4">
            {/* Top left - Car on city street */}
            <div
              className={`${isParallaxActive ? 'parallax-element' : ''}`}
              data-speed={isMdContainer ? '0.2' : '0.2'}
            >
              {image1 && (
                <ImageWrapper
                  data-component="image-1"
                  image={image1}
                  className="rounded-default h-auto w-full"
                />
              )}
            </div>

            {/* Top right - Car by wall */}
            <div
              className={`${isParallaxActive ? 'parallax-element' : ''}`}
              data-speed={isMdContainer ? '0.1' : '-0.01'}
            >
              {image2 && (
                <ImageWrapper
                  data-component="image-2"
                  image={image2}
                  className="rounded-default h-auto w-full"
                />
              )}
            </div>

            {/* Bottom left - Interior detail */}
            <div
              className={`${isParallaxActive ? 'parallax-element' : ''}`}
              data-speed={isMdContainer ? '0.05' : '0.08'}
            >
              {image3 && (
                <ImageWrapper
                  data-component="image-3"
                  image={image3}
                  className="rounded-default h-auto w-full"
                />
              )}
            </div>

            {/* Bottom right - Interior detail */}
            <div
              className={`${isParallaxActive ? 'parallax-element' : ''}`}
              data-speed={isMdContainer ? '0.0' : '-0.01'}
            >
              {image4 && (
                <ImageWrapper
                  data-component="image-4"
                  image={image4}
                  className="rounded-default h-auto w-full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <NoDataFallback componentName="ImageGalleryGrid" />;
};
