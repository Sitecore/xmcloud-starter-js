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
export const ImageGalleryFiftyFifty: React.FC<ImageGalleryProps> = (props) => {
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

        <div className="relative mx-auto max-w-7xl">
          {/* Asymmetrical layout with CSS grid */}
          <div className="@md:gap-0 grid grid-cols-12 gap-4">
            {/* Left column with title and description */}
            <div className="@md:col-span-6 @md:mb-0 col-span-12 mb-8 flex flex-col justify-center  py-10">
              <div
                className={`mb-6 ${isParallaxActive ? 'parallax-element' : ''}`}
                data-speed="0.1"
              >
                {title && <Text tag="h2" field={title} />}
              </div>
              <div className={`${isParallaxActive ? 'parallax-element' : ''}`} data-speed="0.05">
                {description && <Text tag="p" className="text-xl" field={description} />}
              </div>
            </div>

            {/* Top right image - Car on city street */}
            <div
              className={`@md:col-span-6 col-span-12  ${
                isParallaxActive ? 'parallax-element' : ''
              }`}
              data-component="image-1"
              data-speed={isMdContainer ? '0.3' : '0.2'}
            >
              {image1 && (
                <ImageWrapper
                  image={image1}
                  wrapperClass="w-full relative rounded-default aspect-square "
                  className=" h-full w-full object-cover"
                  data-component="image-1"
                />
              )}
            </div>

            {/* Bottom left image - Car by wall */}
            <div
              className={`@md:col-span-6 @md:mt-12 col-span-12 mt-8 ${
                isParallaxActive ? 'parallax-element' : ''
              }`}
              data-speed={isMdContainer ? '0.2' : '-0.01'}
              data-component="image-2"
            >
              {image2 && (
                <ImageWrapper
                  image={image2}
                  wrapperClass="w-full relative rounded-default aspect-square "
                  className="h-full w-full object-cover"
                  data-component="image-2"
                />
              )}
            </div>
            {/* Empty space for asymmetry */}
            <div className="@md:block @md:col-span-6 hidden"></div>
            {/* Empty space for asymmetry */}
            <div className="@md:block @md:col-span-6 hidden"></div>

            {/* Bottom right image - Panoramic roof */}
            <div
              className={`@md:col-span-6 @md:mt-24 col-span-12 mt-8 ${
                isParallaxActive ? 'parallax-element' : ''
              }`}
              data-speed={isMdContainer ? '0.1' : '0.2'}
            >
              {image3 && (
                <ImageWrapper
                  image={image3}
                  wrapperClass="w-full relative rounded-default aspect-square"
                  className="h-full w-full object-cover"
                  data-component="image-3"
                />
              )}
            </div>
            {/* Empty space for asymmetry */}
            <div className="@md:block @md:col-span-6 hidden"></div>

            {/* Empty space for asymmetry */}
            <div className="@md:block @md:col-span-6 hidden"></div>
            {/* Bottom right image - Interior detail */}

            <div
              className={`@md:col-span-6 @md:mt-16 col-span-12 mt-8 ${
                isParallaxActive ? 'parallax-element' : ''
              }`}
              data-speed={isMdContainer ? '0.00' : '-0.1'}
            >
              {image4 && (
                <ImageWrapper
                  image={image4}
                  wrapperClass="w-full relative rounded-default aspect-square "
                  className=" h-full w-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <NoDataFallback componentName="ImageGalleryFiftyFifty" />;
};
