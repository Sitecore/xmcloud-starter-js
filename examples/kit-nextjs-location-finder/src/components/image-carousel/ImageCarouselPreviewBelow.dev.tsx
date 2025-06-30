/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import type { ImageCarouselProps } from './image-carousel.props';
import { useMatchMedia } from '@/hooks/use-match-media';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { ImageCarouselEditMode } from './ImageCarouselEditMode.dev';
import { cn } from '@/lib/utils';

export const ImageCarouselPreviewBelow = (props: ImageCarouselProps) => {
  const { fields, isPageEditing } = props;

  // Common Tailwind class groups
  const containerClasses =
    '@container bg-background text-foreground group relative flex w-full flex-col items-center justify-center py-[99px]';
  const titleClasses =
    'font-heading @md:text-7xl mx-auto max-w-[760px] text-pretty px-4 text-5xl font-light leading-none tracking-normal antialiased group-[.position-left]:text-left group-[.position-center]:text-center group-[.position-right]:text-right';
  const carouselWrapperClasses = 'relative mx-auto w-full max-w-screen-xl px-4';
  const carouselItemClasses = 'pointer-events-none flex h-full basis-full flex-col justify-stretch';
  const thumbnailWrapperClasses =
    'px-4 mt-4 @md:mt-0 @md:px-0 flex items-center justify-center gap-2 @md:gap-4 max-w-screen-xl mx-auto @md:-translate-y-1/2';
  const thumbnailImageClasses = 'h-auto w-full transition-all border-2 border-transparent';
  const thumbnailActiveClasses = '';

  const { title, imageItems } = fields.data.datasource;
  const { results: slides } = imageItems;

  // State for tracking current slide
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainApi, setMainApi] = useState<any>(null);
  const [thumbApi, setThumbApi] = useState<any>(null);

  const slideshowId = useId();
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Update the live region when the current slide changes
  useEffect(() => {
    if (liveRegionRef.current && mainApi && slides && slides.length > 0) {
      liveRegionRef.current.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}`;
    }
  }, [currentIndex, slides, mainApi]);

  // Set up the carousel API and event listeners
  useEffect(() => {
    if (!mainApi) return;

    mainApi.on('select', () => {
      const index = mainApi.selectedScrollSnap();
      setCurrentIndex(index);
      if (thumbApi) {
        thumbApi.scrollTo(index);
      }
    });

    // Initial setup
    setCurrentIndex(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi]);

  // Function to handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    if (mainApi) {
      mainApi.scrollTo(index);
    }
  };

  if (fields) {
    const hasPagesPositionStyles: boolean = props?.params?.styles
      ? props?.params?.styles.includes('position-')
      : false;

    if (isPageEditing) {
      return (
        <ImageCarouselEditMode
          {...props}
          componentName="ImageCarouselPreviewBelow"
          showBackgroundText={false}
        />
      );
    }

    return (
      <div
        className={cn(containerClasses, {
          'position-center': !hasPagesPositionStyles,
          [props?.params?.styles]: props?.params?.styles,
        })}
        role="region"
        data-component="ImageCarouselPreviewBelow"
      >
        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
        >
          <div className="mb-4 w-full space-y-4 px-4">
            <Text tag="h2" field={title.jsonValue} className={titleClasses} />
          </div>
        </AnimatedSection>
        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
          delay={300}
        >
          <div className="mb-12 flex justify-center" role="group" aria-label="Call to action">
            {slides[currentIndex]?.link?.jsonValue && (
              <EditableButton
                variant="default"
                buttonLink={slides[currentIndex].link.jsonValue}
                isPageEditing={isPageEditing}
              />
            )}
          </div>
        </AnimatedSection>

        {/* Screen reader only live region to announce slide changes */}
        <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true"></div>
        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
          delay={600}
        >
          {/* Main Carousel */}
          <div className={carouselWrapperClasses} data-component-part="main-carousel-wrapper">
            <Carousel
              setApi={setMainApi}
              opts={{
                align: 'center',
                loop: true,
                skipSnaps: false,
                containScroll: 'trimSnaps',
              }}
              className="w-full overflow-visible"
              aria-labelledby={`${slideshowId}-title`}
              data-component-part="main-carousel"
            >
              <div id={`${slideshowId}-title`} className="sr-only">
                {currentIndex + 1} of {slides.length}
              </div>

              <CarouselContent
                className="h-full items-stretch"
                data-component-part="main-carousel-content"
              >
                {slides.map((slide, index) => (
                  <CarouselItem
                    key={index}
                    className={carouselItemClasses}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index === currentIndex ? 'current slide' : ''}`}
                    tabIndex={index === currentIndex ? 0 : -1}
                    data-component-part="main-carousel-item"
                    style={{
                      opacity: index === currentIndex ? 1 : 0,
                    }}
                  >
                    <div className="relative">
                      <ImageWrapper
                        image={slide.image?.jsonValue}
                        className="relative z-0 h-auto w-full"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </AnimatedSection>
        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
          delay={800}
        >
          {/* Thumbnail Navigation Carousel */}
          <div className={thumbnailWrapperClasses} data-component-part="thumbnail-carousel-wrapper">
            <Button
              variant="default"
              size="icon"
              onClick={() => {
                mainApi?.scrollPrev();
                thumbApi?.scrollPrev();
              }}
              aria-label="Previous slide"
              aria-controls={`${slideshowId}-title`}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Carousel
              setApi={setThumbApi}
              opts={{
                align: 'start',
                loop: true,
                dragFree: true,
                slidesToScroll: 1,
              }}
              className={'w-full max-w-[390px]'}
              data-component-part="thumbnail-carousel"
            >
              <CarouselContent className="-ml-2" data-component-part="thumbnail-carousel-content">
                {slides.map((slide, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/2 pl-2"
                    data-component-part="thumbnail-carousel-item"
                  >
                    <button
                      onClick={() => handleThumbnailClick(index)}
                      tabIndex={0}
                      aria-label={`Go to slide ${index + 1}`}
                      aria-current={index === currentIndex ? 'true' : 'false'}
                    >
                      <ImageWrapper
                        image={slide.image?.jsonValue}
                        className={cn(thumbnailImageClasses, {
                          [thumbnailActiveClasses]: index === currentIndex,
                        })}
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <Button
              variant="default"
              size="icon"
              onClick={() => {
                mainApi?.scrollNext();
                thumbApi?.scrollNext();
              }}
              aria-label="Next slide"
              aria-controls={`${slideshowId}-title`}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </AnimatedSection>
        {/* Keyboard navigation instructions for screen readers */}
        <div className="sr-only">Use left and right arrow keys to navigate between slides.</div>
      </div>
    );
  }

  return <NoDataFallback componentName="ImageCarouselPreviewBelow" />;
};
