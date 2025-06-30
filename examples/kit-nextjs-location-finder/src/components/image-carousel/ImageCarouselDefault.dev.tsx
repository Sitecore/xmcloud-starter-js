'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import type { ImageCarouselProps } from './image-carousel.props';
import { ButtonBase } from '../button-component/ButtonComponent';
import { useMatchMedia } from '@/hooks/use-match-media';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ImageCarouselEditMode } from './ImageCarouselEditMode.dev';
import { cn } from '@/lib/utils';
export const ImageCarouselDefault = (props: ImageCarouselProps) => {
  const { fields, isPageEditing } = props;

  // Common Tailwind class groups
  const containerClasses =
    '@container group bg-primary text-primary-foreground relative flex w-full flex-col items-center justify-center py-[99px]';
  const titleWrapperClasses =
    'w-full space-y-4 px-4 group-[.position-center]:text-center group-[.position-right]:text-right';
  const titleClasses =
    'font-heading @md:text-7xl mx-auto max-w-[760px] text-pretty px-4 text-5xl text-box-trim-bottom-baseline';
  const carouselContentClasses = '-ml-[100px] h-full items-stretch';
  const carouselItemClasses =
    '@md:basis-4/5 @lg:basis-2/3 pointer-events-none flex h-full basis-full flex-col justify-stretch pl-[100px] @md:max-w-1/2 mx-auto';
  const slideContentClasses =
    '@md:px-25 @md:-mt-[20%] @lg:-mt-[30%] @xl:-mt-[20%] @3xl:-mt-[10%] h-full w-full transform-gpu px-6 transition-all ease-in-out';
  const backgroundTextWrapperClasses =
    'flex h-full w-full translate-y-[-50%] items-center justify-center transition-all duration-700 ease-in-out';
  const backgroundTextClasses =
    'bg-primary-gradient text-fill-transparent text-[100px] @md:text-40-clamp bg-clip-text font-bold leading-none text-transparent';
  const mainImageClasses = 'relative z-0 h-auto w-full max-w-[860px] mx-auto';
  const controlsWrapperClasses = 'mt-8 flex items-center gap-4';

  const { title, imageItems } = fields?.data?.datasource ?? {};
  const { results: slides } = imageItems ?? { slides: {} };

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
      const currentSlide = slides[currentIndex];
      liveRegionRef.current.textContent = `Showing slide ${currentIndex + 1} of ${slides.length}: ${
        currentSlide.backgroundText?.jsonValue?.value
      }.`;
    }
  }, [currentIndex, slides, api]);

  // Set up the carousel API and event listeners
  useEffect(() => {
    if (!api) return;

    // Hide background text when slide change starts
    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
    });

    // Initial setup
    setCurrentIndex(api.selectedScrollSnap());
  }, [api]);

  if (fields) {
    // Render stacked list in edit mode
    if (isPageEditing) {
      return <ImageCarouselEditMode {...props} componentName="ImageCarouselDefault" />;
    }

    const hasPagesPositionStyles: boolean = props?.params?.styles
      ? props?.params?.styles.includes('position-')
      : false;

    // Normal carousel view for non-edit mode
    return (
      <div
        className={cn(containerClasses, {
          'position-center': !hasPagesPositionStyles,
          [props?.params?.styles]: props?.params?.styles,
        })}
        data-component="ImageCarouselDefault"
      >
        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
        >
          <div className={titleWrapperClasses}>
            <Text tag="h2" field={title.jsonValue} className={titleClasses} />
          </div>
        </AnimatedSection>

        {/* Screen reader only live region to announce slide changes */}
        <div ref={liveRegionRef} className="sr-only" aria-live="polite" aria-atomic="true"></div>

        <div className="w-full" data-component-part="carousel wrapper">
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
              Vehicle Models Slideshow, {currentIndex + 1} of {slides.length}
            </div>

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
                  aria-label={`${slide?.backgroundText?.jsonValue?.value || ''}, ${
                    index === currentIndex ? 'current slide' : ''
                  }`}
                  tabIndex={index === currentIndex ? 0 : -1}
                  data-component-part="carousel item"
                >
                  <div
                    className={`${slideContentClasses} ${
                      index === currentIndex ? 'scale-100' : 'scale-95'
                    }`}
                  >
                    {slide?.backgroundText?.jsonValue && (
                      <div
                        className={backgroundTextWrapperClasses}
                        style={{
                          opacity: index === currentIndex ? 1 : 0,
                          filter: index === currentIndex ? 'blur(0px)' : 'blur(10px)',
                          transform:
                            index === currentIndex
                              ? 'scale(1) translateY(40%)'
                              : 'scale(0.3) translateY(100%)',
                          transitionDelay: '200ms',
                        }}
                      >
                        <Text
                          tag="p"
                          field={slide?.backgroundText?.jsonValue}
                          className={backgroundTextClasses}
                        />
                      </div>
                    )}
                  </div>
                  <ImageWrapper image={slide.image?.jsonValue} className={mainImageClasses} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={isReducedMotion}
        >
          <div className={controlsWrapperClasses} role="group" aria-label="Slideshow controls">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => api?.scrollPrev()}
              aria-label="Previous slide"
              aria-controls={`${slideshowId}-title`}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            {slides[currentIndex]?.link?.jsonValue && (
              <ButtonBase variant="secondary" buttonLink={slides[currentIndex].link.jsonValue} />
            )}

            <Button
              variant="secondary"
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
  return <NoDataFallback componentName="ImageCarousel" />;
};
