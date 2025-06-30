'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import type { ImageCarouselProps } from './image-carousel.props';
import { useMatchMedia } from '@/hooks/use-match-media';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { ImageCarouselEditMode } from './ImageCarouselEditMode.dev';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useContainerQuery } from '@/hooks/use-container-query';

export const ImageCarouselFeaturedImageLeft = (props: ImageCarouselProps) => {
  const { fields, isPageEditing } = props;

  const { title, imageItems } = fields.data.datasource;
  const { results: slides } = imageItems;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideOrder, setSlideOrder] = useState<number[]>([]);
  const [nextSlideIndex, setNextSlideIndex] = useState<number | null>(null);

  // Accessibility reference for live region
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use container query for responsive breakpoints - only use mobile breakpoint
  const isMobile = useContainerQuery(containerRef, 'md', 'max');

  // Initialize slide order
  useEffect(() => {
    if (slides && slides.length > 0) {
      setSlideOrder(Array.from({ length: slides.length }, (_, i) => i));
    }
  }, [slides]);

  // Update the live region when the current slide changes
  useEffect(() => {
    if (liveRegionRef.current && slides && slides.length > 0) {
      liveRegionRef.current.textContent = `Showing slide ${activeIndex + 1} of ${slides.length}`;
    }
  }, [activeIndex, slides]);

  const handleNext = () => {
    if (isAnimating || slides.length <= 1) return;

    setIsAnimating(true);

    // Set the next slide index (the one that will animate on top)
    setNextSlideIndex(1);

    // Update active index
    setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);

    // Wait for the animation to complete before updating the slide order
    setTimeout(
      () => {
        // Update the slide order by moving the first slide to the end
        setSlideOrder((prevOrder) => {
          const newOrder = [...prevOrder];
          const firstSlide = newOrder.shift() as number;
          newOrder.push(firstSlide);
          return newOrder;
        });

        // Reset the next slide index
        setNextSlideIndex(null);

        // Reset animation state
        setIsAnimating(false);
      },
      isReducedMotion ? 0 : 600
    ); // Instant for reduced motion, otherwise match animation duration
  };

  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');

  if (fields) {
    const hasPagesPositionStyles: boolean = props?.params?.styles
      ? props?.params?.styles.includes('position-')
      : false;

    if (isPageEditing) {
      return (
        <ImageCarouselEditMode
          {...props}
          componentName="ImageCarouselFeaturedImageLeft"
          showBackgroundText={false}
        />
      );
    }

    // Define the dimensions for slides
    const activeSlideWidth = 941;
    const activeSlideHeight = 526;
    const thumbnailWidth = 333;
    const thumbnailHeight = 186;

    // Calculate responsive dimensions
    return (
      <div
        className={cn(
          '@container bg-background text-foreground group relative flex w-full flex-col items-center justify-center overflow-hidden py-[60px]',
          {
            'position-left': !hasPagesPositionStyles,
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
        role="region"
        aria-roledescription="carousel"
        data-component="ImageCarouselFeaturedImageLeft"
      >
        {/* Screen reader only live region to announce slide changes */}
        <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true"></div>

        <div className="mx-auto w-full max-w-screen-2xl">
          <div className="@md:flex-row @md:justify-between flex w-full flex-col items-end justify-start group-[.position-right]:justify-end group-[.position-center]:justify-center ">
            <AnimatedSection
              direction="up"
              isPageEditing={isPageEditing}
              reducedMotion={isReducedMotion}
              className="max-w-screen-md px-0"
            >
              <Text
                tag="h2"
                field={title.jsonValue}
                className="font-heading @md:text-7xl max-w-[760px] text-pretty text-5xl font-light leading-none tracking-normal antialiased group-[.position-left]:text-left group-[.position-center]:text-center group-[.position-right]:text-right"
              />
            </AnimatedSection>

            <AnimatedSection
              direction="up"
              isPageEditing={isPageEditing}
              reducedMotion={isReducedMotion}
              delay={200}
              className="@md:w-auto w-full"
            >
              <div
                className="@md:mt-0 @md:justify-center mt-8 flex w-full items-center justify-start"
                role="group"
                aria-label="Slideshow controls"
              >
                {slideOrder.length > 0 &&
                  slides[slideOrder[nextSlideIndex === 1 ? 1 : 0]]?.link?.jsonValue && (
                    <EditableButton
                      buttonLink={slides[slideOrder[nextSlideIndex === 1 ? 1 : 0]].link.jsonValue}
                      className="mb-6"
                    />
                  )}
              </div>
            </AnimatedSection>
          </div>
        </div>
        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
          delay={300}
          className="@md:overflow-visible h-full w-full overflow-hidden py-6"
        >
          <div ref={containerRef} className="mx-auto w-full max-w-screen-2xl">
            {/* Carousel container */}
            <div
              className={cn(
                'mb-6 flex overflow-visible transition-all',
                isMobile ? 'h-auto items-center justify-center' : 'h-[532px] items-end'
              )}
            >
              {/* Slide deck with animated transitions */}
              <div
                data-component="slide deck"
                className="relative flex h-full w-full items-end overflow-visible"
              >
                {slideOrder.length > 0 && (
                  <div className="@md:absolute @md:inset-0 flex">
                    {slideOrder.map((slideIndex, position) => {
                      // Determine if this slide is the active one or the next one that will animate on top
                      const isActive = position === 0;
                      const isNext = nextSlideIndex !== null && position === nextSlideIndex;
                      const isDeckSlide = position > 1;

                      // On mobile, only show active slide and next slide during animation
                      if (isMobile && !isActive && !(isNext && isAnimating)) {
                        return null;
                      }

                      // Calculate z-index - next slide should be on top during animation
                      const zIndex = isNext ? 20 : isActive ? 10 : 5 - position;

                      // Calculate the width and height based on position and responsive state
                      let width, height;

                      if (isMobile) {
                        // Mobile view - full width
                        width = '100%';
                        height = 'auto';
                      } else {
                        // Desktop view
                        width = isActive || isNext ? activeSlideWidth : thumbnailWidth;
                        height = isActive || isNext ? activeSlideHeight : thumbnailHeight;
                      }

                      // Calculate the left position - no gaps between slides
                      let leftPosition;

                      if (isAnimating) {
                        if (isNext) {
                          // Next slide animates from right to directly on top of active slide
                          leftPosition = isMobile ? ['100%', 0] : [activeSlideWidth, 0];
                        } else if (isActive) {
                          // Active slide stays in place
                          leftPosition = 0;
                        } else if (isDeckSlide && !isMobile) {
                          // Deck slides animate to the left
                          const currentPos = activeSlideWidth + (position - 1) * thumbnailWidth;
                          const targetPos = activeSlideWidth + (position - 2) * thumbnailWidth;
                          leftPosition = [currentPos, targetPos];
                        } else if (!isMobile) {
                          // Position 1 slide (which will be hidden by the animating next slide)
                          leftPosition = activeSlideWidth;
                        }
                      } else {
                        // Normal positioning when not animating - no gaps
                        if (isMobile) {
                          leftPosition = 0; // On mobile, active slide is centered
                        } else {
                          leftPosition = isActive
                            ? 0
                            : activeSlideWidth + (position - 1) * thumbnailWidth;
                        }
                      }

                      // For the next slide that's animating in, we need to animate its position
                      let topPosition;

                      if (isNext && isAnimating && !isMobile) {
                        // Full desktop mode
                        topPosition = [activeSlideHeight - thumbnailHeight, 0];
                      } else if (!isMobile) {
                        // Static positioning - active slides at top (0), thumbnails aligned at bottom
                        topPosition = isActive ? 0 : activeSlideHeight - thumbnailHeight;
                      } else {
                        // On mobile, all slides are at top 0
                        topPosition = 0;
                      }

                      return (
                        <motion.div
                          key={`slide-${slideIndex}`}
                          className={cn(
                            '@md:absolute flex-shrink-0',
                            isMobile && (isActive || isNext) && 'aspect-[941/526] w-full'
                          )}
                          style={{
                            zIndex,
                          }}
                          initial={false}
                          animate={{
                            width,
                            height,
                            left: leftPosition,
                            top: topPosition,
                            scale: 1,
                          }}
                          transition={{
                            duration: isReducedMotion ? 0 : isAnimating ? 0.6 : 0,
                            ease: 'easeInOut',
                            left:
                              isAnimating && !isReducedMotion
                                ? {
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                  }
                                : undefined,
                            top:
                              isAnimating && isNext && !isReducedMotion
                                ? {
                                    type: 'spring',
                                    stiffness: 300,
                                    damping: 30,
                                  }
                                : undefined,
                            scale:
                              isNext && isAnimating && !isReducedMotion
                                ? {
                                    duration: 0.5,
                                  }
                                : undefined,
                          }}
                          role="group"
                          aria-roledescription="slide"
                          aria-label={`${isActive || isNext ? 'Current slide' : 'Slide'} ${
                            slideIndex + 1
                          } of ${slides.length}`}
                        >
                          <div
                            className={cn(
                              'relative overflow-hidden shadow-lg',
                              isMobile && (isActive || isNext)
                                ? 'aspect-[941/526] w-full'
                                : 'h-full w-full'
                            )}
                          >
                            <ImageWrapper
                              image={slides[slideIndex].image.jsonValue}
                              className="object-cover"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="@md:mt-8 mt-4 flex justify-center">
              <Button
                onClick={handleNext}
                variant="outline"
                disabled={isAnimating || slides.length <= 1}
              >
                Next Image
              </Button>
            </div>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return <NoDataFallback componentName="ImageCarouselFeaturedImageLeft" />;
};
