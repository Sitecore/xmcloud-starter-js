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

export const ImageGalleryNoSpacing: React.FC<ImageGalleryProps> = (props) => {
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
          '@container relative min-h-[100vh] max-w-screen-xl overflow-hidden bg-black text-white',
          {
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
        data-class-change
      >
        {/* Centered header section */}
        <div className="mb-16 text-center">
          <div
            className={`${isParallaxActive ? 'parallax-element' : ''}`}
            data-speed={isMdContainer ? '-0.05' : '-0.03'}
          >
            {title && <Text tag="h2" field={title} />}
          </div>

          <div
            className={`mx-auto max-w-2xl ${isParallaxActive ? 'parallax-element' : ''}`}
            data-speed={isMdContainer ? '-0.1' : '-0.01'}
          >
            {description && <Text tag="p" className="text-xl" field={description} />}
          </div>
        </div>

        {/* Accessibility notice for motion preferences */}
        {prefersReducedMotion && (
          <div className="sr-only" aria-live="polite">
            Parallax effects have been disabled due to your reduced motion preference.
          </div>
        )}

        <div className="relative">
          {/* Full-width featured image */}
          <div
            className={`${isParallaxActive ? 'parallax-element' : ''} w-full`}
            data-speed={isMdContainer ? '0.2' : '0.1'}
          >
            {image1 && (
              <ImageWrapper data-component="image-1" image={image1} className="h-auto w-full" />
            )}
          </div>

          {/* 2x2 Grid with no spacing */}
          <div className="@md:grid-cols-2 grid grid-cols-1">
            <div>
              {/* Top left */}
              <div
                className={`${isParallaxActive ? 'parallax-element' : ''}`}
                data-speed={isMdContainer ? '0.1' : '-0.0'}
              >
                {image1 && (
                  <ImageWrapper data-component="image-2" image={image2} className="h-auto w-full" />
                )}
              </div>

              {/* bottom left */}
              <div
                className={`${isParallaxActive ? 'parallax-element' : ''}`}
                data-speed={isMdContainer ? '0.05' : '-0.05'}
              >
                {image3 && (
                  <ImageWrapper data-component="image-3" image={image3} className="h-auto w-full" />
                )}
              </div>
            </div>
            <div>
              {/* Bottom left */}
              <div
                className={`${isParallaxActive ? 'parallax-element' : ''}`}
                data-speed={isMdContainer ? '0.0' : '-0.1'}
              >
                {image4 && (
                  <ImageWrapper data-component="image-4" image={image4} className="h-auto w-full" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <NoDataFallback componentName="ImageGalleryNoSpacing" />;
};
