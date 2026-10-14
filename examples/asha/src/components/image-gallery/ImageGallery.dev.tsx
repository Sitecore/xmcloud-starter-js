'use client';

import type React from 'react';
import { useRef } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import type { ImageGalleryProps } from './image-gallery.props';
import { useParallaxEnhancedOptimized } from '@/hooks/use-parallax-enhanced-optimized';
import { useMatchMedia } from '@/hooks/use-match-media';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';
import { useContainerQuery } from '@/hooks/use-container-query';

export const ImageGalleryDefault: React.FC<ImageGalleryProps> = (props) => {
  const { fields, isPageEditing } = props;
  const prefersReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const containerRef = useRef<HTMLDivElement>(null);
  const { title, description, image1, image2, image3, image4 } = fields || {};
  const isMdContainer = useContainerQuery(containerRef, 'md', 'max');

  // Use our enhanced parallax hook with reduced motion check
  const { isParallaxActive } = useParallaxEnhancedOptimized(containerRef, {
    disabled: isPageEditing || prefersReducedMotion,
  });

  if (fields) {
    return (
      <div
        ref={containerRef}
        className={cn('@container group relative min-h-[100vh] max-w-screen-xl overflow-hidden', {
          [props?.params?.styles]: props?.params?.styles,
        })}
        data-class-change
      >
        <div className="@xl:px-0 px-0 [&:not(.px-6_&):not(.px-8_&):not(.px-10_&)]:px-6">
          {/* Accessibility notice for motion preferences */}
          {prefersReducedMotion && (
            <div className="sr-only" aria-live="polite">
              Parallax effects have been disabled due to your reduced motion preference.
            </div>
          )}

          <div className="relative mx-auto max-w-7xl py-16">
            {/* Layout matching the original design */}
            <div className=" grid grid-cols-12 items-start  gap-4">
              {/* Top left image - Car on city street */}
              <div
                className={`@md:col-span-7 col-span-12 ${
                  isParallaxActive ? 'parallax-element' : ''
                }`}
              >
                {image1 && (
                  <ImageWrapper
                    data-component="image-1"
                    image={image1}
                    className="rounded-default h-auto w-full max-w-[581px]"
                  />
                )}
              </div>

              {/* Text content - Right side */}
              <div
                className={`@md:col-span-6 @md:col-start-8 col-span-12 flex flex-col py-[160px]  pt-0 ${
                  isParallaxActive ? 'parallax-element' : ''
                }`}
                data-speed={isMdContainer ? '0.1' : '0.0'}
              >
                {title && <Text tag="h2" field={title} />}
                {description && <Text tag="p" field={description} className="text-xl" />}
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              {/* Middle right image - Car by concrete wall */}
              <div
                className={`@md:col-span-8 @md:col-start-6 z-10 col-span-12 -mt-[80px] mr-[70px] transform-gpu ${
                  isParallaxActive ? 'parallax-element' : ''
                }`}
                data-speed={isMdContainer ? '0.08' : '0.08'}
              >
                {image2 && (
                  <ImageWrapper
                    data-component="image-2"
                    image={image2}
                    className="rounded-default h-auto w-full max-w-[600px]"
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 items-end gap-4">
              {/* Bottom left image - Interior panoramic roof */}
              <div
                className={`testing-here @md:col-span-7 @md:col-start-1 col-span-12 ${
                  isParallaxActive ? 'parallax-element' : ''
                }`}
                data-speed="0"
              >
                {image3 && (
                  <ImageWrapper
                    data-component="image-3"
                    image={image3}
                    className="rounded-default h-auto w-full"
                  />
                )}
              </div>
              {/* Bottom right image - Interior detail */}
              <div
                className={`@md:col-span-7 @md:col-start-8 col-span-12 items-end ${
                  isParallaxActive ? 'parallax-element' : ''
                }`}
                data-speed="0"
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
      </div>
    );
  }
  return <NoDataFallback componentName="ImageGalleryDefault" />;
};
