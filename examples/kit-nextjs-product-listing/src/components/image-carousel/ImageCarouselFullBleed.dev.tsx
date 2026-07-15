'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import type { ImageCarouselProps } from './image-carousel.props';
import { EditableButton } from '../button-component/ButtonComponent';
import { useMatchMedia } from '@/hooks/use-match-media';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ImageCarouselEditMode } from './ImageCarouselEditMode.dev';
import { cn } from '@/lib/utils';
export const ImageCarouselFullBleed = (props: ImageCarouselProps) => {
  const { fields, isPageEditing } = props;
  const { title, imageItems } = fields?.data?.datasource ?? {};
  const { results: slides = [] } = imageItems || {};

  // Common Tailwind class groups
  const containerClasses = '@container group bg-primary grid w-full grid-cols-1 gap-9';
  const headerWrapperClasses = 'mx-auto w-full max-w-screen-2xl px-4';
  const headerContentClasses =
    '@md:flex-row flex w-full flex-col items-end justify-between group-[.position-right]:justify-end group-[.position-center]:justify-center';
  const titleClasses =
    'font-heading text-pretty px-4 font-light leading-none tracking-normal antialiased group-[.position-center]:text-center group-[.position-right]:text-right group-[.position-center]:mx-auto';
  const controlsWrapperClasses = '@md:mt-0 mt-8 flex items-center justify-center';
  const carouselContentClasses = '!ml-0 h-full items-stretch';
  const carouselItemClasses = 'pointer-events-none max-w-screen-2xl p-0 pl-0';
  const navButtonBaseClasses =
    'border-1 border-primary-foreground absolute top-1/2 z-20 -translate-y-1/2 transform';
  const prevButtonClasses = `${navButtonBaseClasses} @2xl:-translate-x-1/2 left-4 -ms-4`;
  const nextButtonClasses = `${navButtonBaseClasses} @2xl:translate-x-1/2 right-4 -me-4`;

  // State for tracking current slide
  const [currentIndex, setCurrentIndex] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);

  const slideshowId = useId();
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const liveRegionRef = useRef<HTMLDivElement>(null);

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

  if (fields) {
    const hasPagesPositionStyles: boolean = props?.params?.styles
      ? props?.params?.styles.includes('position-')
      : false;

    if (isPageEditing) {
      return (
        <ImageCarouselEditMode
          {...props}
          componentName="ImageCarouselFullBleed"
          showBackgroundText={false}
        />
      );
    }
    return (
      <div
        className={cn(containerClasses, {
          'position-left': !hasPagesPositionStyles,
          [props?.params?.styles]: props?.params?.styles,
        })}
        data-class-change
        data-component="ImageCarouselFullBleed"
      >
        {/* Blue header section with title */}
        <div className={headerWrapperClasses}>
          <div className={headerContentClasses}>
            <AnimatedSection
              direction="up"
              isPageEditing={isPageEditing}
              reducedMotion={isReducedMotion}
              className="max-w-screen-md"
            >
              <Text tag="h2" field={title?.jsonValue} className={titleClasses} />
            </AnimatedSection>

            <AnimatedSection
              direction="up"
              isPageEditing={isPageEditing}
              reducedMotion={isReducedMotion}
              delay={200}
            >
              <div className={controlsWrapperClasses} role="group" aria-label="Slideshow controls">
                {slides[currentIndex]?.link?.jsonValue && (
                  <EditableButton
                    variant="secondary"
                    buttonLink={slides[currentIndex].link.jsonValue}
                    className="mb-6"
                  />
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Screen reader only live region to announce slide changes */}
        <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true"></div>

        <div className="relative w-full" data-component-part="carousel wrapper">
          {/* Left navigation button */}

          <Carousel
            setApi={setApi}
            opts={{
              align: 'center',
              loop: true,
              skipSnaps: false,
              containScroll: false, // Allow content to overflow
            }}
            className="w-full overflow-visible"
            aria-labelledby={`${slideshowId}-title`}
            data-component-part="carousel"
          >
            <div id={`${slideshowId}-title`} className="sr-only">
              Vehicle Models Slideshow, {currentIndex + 1} of {slides.length}
            </div>

            {/* Remove any default spacing from CarouselContent */}
            <CarouselContent
              className={carouselContentClasses}
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
                >
                  <div className="relative flex justify-center">
                    <div className="w-full">
                      <ImageWrapper
                        image={slide.image?.jsonValue}
                        className="relative z-0 h-auto w-full"
                        wrapperClass=" object-cover h-full w-full"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute left-0 top-1/2 flex w-full">
            <div className="relative mx-auto w-full max-w-screen-2xl ">
              <Button
                variant="default"
                size="icon"
                onClick={() => api?.scrollPrev()}
                aria-label="Previous slide"
                aria-controls={`${slideshowId}-title`}
                className={prevButtonClasses}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              {/* Right navigation button */}
              <Button
                variant="default"
                size="icon"
                onClick={() => api?.scrollNext()}
                aria-label="Next slide"
                aria-controls={`${slideshowId}-title`}
                className={nextButtonClasses}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Keyboard navigation instructions for screen readers */}
        <div className="sr-only">Use left and right arrow keys to navigate between slides.</div>
      </div>
    );
  }

  return <NoDataFallback componentName="ImageCarousel" />;
};
