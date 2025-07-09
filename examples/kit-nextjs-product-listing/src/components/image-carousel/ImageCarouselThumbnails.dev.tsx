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

export const ImageCarouselThumbnails = (props: ImageCarouselProps) => {
  const { fields, isPageEditing } = props;
  // Common Tailwind class groups
  const containerClasses =
    '@container bg-primary text-primary-foreground group relative flex w-full flex-col items-center justify-center py-16';
  const titleClasses =
    'font-heading @md:text-6xl mx-auto max-w-[760px] text-pretty px-4 text-4xl font-light leading-none tracking-normal antialiased';
  const carouselWrapperClasses = 'w-full max-w-screen-xl mx-auto px-4';
  const mainImageClasses = 'relative z-0 h-auto w-full rounded-lg overflow-hidden';
  const thumbnailImageClasses = 'h-auto w-full aspect-video object-contain';
  const navButtonClasses = 'absolute top-1/2 transform -translate-y-1/2 z-10  ';
  const prevButtonClasses = `${navButtonClasses} left-4`;
  const nextButtonClasses = `${navButtonClasses} right-4`;

  const { title, imageItems } = fields.data.datasource;
  const { results: slides } = imageItems;

  // State for tracking current slide
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>(null);
  const [thumbnailApi, setThumbnailApi] = useState<any>(null);

  const slideshowId = useId();
  const isReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Update the live region when the current slide changes
  useEffect(() => {
    if (liveRegionRef.current && api && slides && slides.length > 0) {
      const currentSlide = slides[currentIndex];
      liveRegionRef.current.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}: ${
        currentSlide.backgroundText?.jsonValue?.value
      }.`;
    }
  }, [currentIndex, slides, api]);

  // Set up the carousel API and event listeners
  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      const index = api.selectedScrollSnap();
      setCurrentIndex(index);

      // Sync thumbnail carousel
      if (thumbnailApi) {
        thumbnailApi.scrollTo(index);
      }
    });

    // Initial setup
    setCurrentIndex(api.selectedScrollSnap());
  }, [api, thumbnailApi]);

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    if (api) {
      api.scrollTo(index);
    }
  };

  if (fields) {
    if (isPageEditing) {
      return <ImageCarouselEditMode {...props} componentName="ImageCarouselThumbnails" />;
    }
    return (
      <div
        className={containerClasses}
        role="region"
        aria-roledescription="carousel"
        aria-label="Vehicle models showcase"
        data-component="ImageCarouselThumbnails"
      >
        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
        >
          <div className="mb-12 w-full space-y-4 px-4 group-[.position-center]:text-center group-[.position-right]:text-right">
            <Text tag="h2" field={title.jsonValue} className={titleClasses} />
          </div>
        </AnimatedSection>

        {/* Screen reader only live region to announce slide changes */}
        <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true"></div>

        <div className={carouselWrapperClasses} data-component-part="carousel wrapper">
          <div className="relative">
            {/* Main carousel */}
            <Carousel
              setApi={setApi}
              opts={{
                align: 'center',
                loop: true,
                skipSnaps: false,
                containScroll: 'trimSnaps',
              }}
              className="mb-4 w-full"
              aria-labelledby={`${slideshowId}-title`}
              data-component-part="carousel"
            >
              <div id={`${slideshowId}-title`} className="sr-only">
                Vehicle Models Slideshow, {currentIndex + 1} of {slides.length}
              </div>

              <CarouselContent
                className="h-full items-stretch"
                data-component-part="carousel content"
              >
                {slides.map((slide, index) => (
                  <CarouselItem
                    key={index}
                    className="pointer-events-none flex h-full basis-full flex-col justify-stretch"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${slide?.backgroundText?.jsonValue?.value || ''}, ${
                      index === currentIndex ? 'current slide' : ''
                    }`}
                    tabIndex={index === currentIndex ? 0 : -1}
                    data-component-part="carousel item"
                  >
                    <div className="relative">
                      <ImageWrapper image={slide.image?.jsonValue} className={mainImageClasses} />
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6"
                        style={{
                          opacity: index === currentIndex ? 1 : 0,
                        }}
                      >
                        <Text
                          tag="p"
                          field={slide?.backgroundText?.jsonValue}
                          className="text-foreground text-4xl font-bold leading-none md:text-5xl"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Navigation buttons overlaid on main carousel */}
              <Button
                variant="secondary"
                size="icon"
                onClick={() => api?.scrollPrev()}
                aria-label="Previous slide"
                className={prevButtonClasses}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              <Button
                variant="secondary"
                size="icon"
                onClick={() => api?.scrollNext()}
                aria-label="Next slide"
                className={nextButtonClasses}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </Carousel>

            {/* Thumbnail carousel */}
            <Carousel
              setApi={setThumbnailApi}
              opts={{
                align: 'start',
                loop: true,
                dragFree: true,
                containScroll: 'trimSnaps',
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {slides.map((slide, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/3 cursor-pointer pl-2 md:basis-1/5 md:pl-4"
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <div
                      className={`rounded-default transition-all ${
                        index === currentIndex
                          ? 'border-primary-foreground scale-105'
                          : 'border-transparent opacity-60'
                      }`}
                    >
                      <ImageWrapper
                        image={slide.image?.jsonValue}
                        className={thumbnailImageClasses}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>

        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
        >
          <div className="mt-8 flex items-center justify-center">
            {slides[currentIndex]?.link?.jsonValue && (
              <EditableButton
                variant="secondary"
                buttonLink={slides[currentIndex].link.jsonValue}
              />
            )}
          </div>
        </AnimatedSection>

        <div className="sr-only">Use left and right arrow keys to navigate between slides.</div>
      </div>
    );
  }

  return <NoDataFallback componentName="ImageCarousel" />;
};
