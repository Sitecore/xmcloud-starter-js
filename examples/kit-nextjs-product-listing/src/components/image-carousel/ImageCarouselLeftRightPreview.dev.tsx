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
export const ImageCarouselLeftRightPreview = (props: ImageCarouselProps) => {
  const { fields, isPageEditing } = props;

  // Common Tailwind class groups
  const containerClasses =
    '@container bg-background text-foreground group relative flex w-full flex-col items-center justify-center py-[99px]';
  const titleClasses =
    'font-heading @md:text-7xl mx-auto max-w-[760px] text-pretty px-4 text-5xl font-light leading-none tracking-normal antialiased group-[.position-left]:text-left group-[.position-center]:text-center group-[.position-right]:text-right';
  const carouselWrapperClasses = 'relative mx-auto w-full max-w-screen-xl px-4';
  const previewImageBaseClasses =
    'absolute top-1/2 z-10 hidden w-1/6 -translate-y-1/2 transform opacity-70 transition-opacity hover:opacity-100 md:block';
  const leftPreviewClasses = `${previewImageBaseClasses} left-0`;
  const rightPreviewClasses = `${previewImageBaseClasses} right-0`;
  const carouselItemClasses =
    'pointer-events-none flex h-full basis-full flex-col justify-stretch md:basis-2/3';
  const controlsWrapperClasses = 'mt-8 flex items-center gap-4';
  const previewImageClasses = 'relative h-auto w-full cursor-pointer';

  const { title, imageItems } = fields?.data?.datasource ?? {};
  const { results: slides = [] } = imageItems || {};

  // State for tracking current slide
  const [currentIndex, setCurrentIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);

  const slideshowId = useId();
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Calculate previous and next indices with wrap-around
  const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;

  // Update the live region when the current slide changes
  useEffect(() => {
    if (liveRegionRef.current && api && slides && slides.length > 0) {
      liveRegionRef.current.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}`;
    }
  }, [currentIndex, slides, api]);

  // Set up the carousel API and event listeners
  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
    });

    // Initial setup
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  if (!fields) {
    return <NoDataFallback componentName="ImageCarousel" />;
  }

  if (fields) {
    const hasPagesPositionStyles: boolean = props?.params?.styles
      ? props?.params?.styles.includes('position-')
      : false;

    if (isPageEditing) {
      return (
        <ImageCarouselEditMode
          {...props}
          componentName="ImageCarouselLeftRightPreview"
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
        data-component="ImageCarouselLeftRightPreview"
      >
        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
        >
          <div className="mb-16 w-full space-y-4 px-4">
            <Text tag="h2" field={title?.jsonValue} className={titleClasses} />
          </div>
        </AnimatedSection>

        {/* Screen reader only live region to announce slide changes */}
        <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true"></div>

        <div className={carouselWrapperClasses} data-component-part="carousel wrapper">
          {/* Left preview image */}
          <button
            className={leftPreviewClasses}
            onClick={() => api?.scrollPrev()}
            aria-label="Previous slide"
          >
            <ImageWrapper
              image={slides[prevIndex]?.image?.jsonValue}
              className={previewImageClasses}
            />
          </button>

          <Carousel
            setApi={setApi}
            opts={{
              align: 'center',
              loop: true,
              skipSnaps: false,
              containScroll: 'trimSnaps',
            }}
            className="w-full overflow-visible"
            aria-labelledby={`${slideshowId}-title`}
            data-component-part="carousel"
          >
            <div id={`${slideshowId}-title`} className="sr-only">
              {currentIndex + 1} of {slides.length}
            </div>

            <CarouselContent
              className="h-full items-stretch"
              data-component-part="carousel content"
            >
              {slides.map((slide, index) => (
                <CarouselItem
                  key={index}
                  className={carouselItemClasses}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index === currentIndex ? 'current slide' : ''}`}
                  tabIndex={index === currentIndex ? 0 : -1}
                  data-component-part="carousel item"
                  style={{
                    opacity: index === currentIndex ? 1 : 0,
                  }}
                >
                  <div className="relative">
                    <ImageWrapper
                      image={slide?.image?.jsonValue}
                      className="relative z-0 h-auto w-full"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Right preview image */}
          <button
            className={rightPreviewClasses}
            onClick={() => api?.scrollNext()}
            aria-label="Next slide"
          >
            <ImageWrapper
              image={slides[nextIndex]?.image?.jsonValue}
              className={previewImageClasses}
            />
          </button>
        </div>

        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
        >
          <div className={controlsWrapperClasses} role="group" aria-label="Slideshow controls">
            <Button
              variant="default"
              size="icon"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous slide"
              aria-controls={`${slideshowId}-title`}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {slides[currentIndex]?.link?.jsonValue && (
              <EditableButton variant="default" buttonLink={slides[currentIndex].link.jsonValue} />
            )}

            <Button
              variant="default"
              size="icon"
              onClick={() => api?.scrollNext()}
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

  return <NoDataFallback componentName="ImageCarouselLeftRightPreview" />;
};
