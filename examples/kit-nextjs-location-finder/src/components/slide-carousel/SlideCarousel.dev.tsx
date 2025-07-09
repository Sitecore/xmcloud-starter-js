'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export interface GalleryProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export interface GalleryItemProps {
  children?: React.ReactNode;
}
export interface SlideCarouselProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export interface SlideCarouselItemWrapProps {
  className?: string;
  children: React.ReactNode;
}

export function SlideCarouselItemWrap({ className = '', children }: SlideCarouselItemWrapProps) {
  return <CarouselItem className={`pl-[20px] ${className}`}>{children}</CarouselItem>;
}

export function SlideCarousel({ children, className = '' }: SlideCarouselProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true); // Default to true for better UX
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Count the number of valid children
  useEffect(() => {
    const count = React.Children.count(children);
    setItemCount(count);

    // If we have more than one item, we should be able to scroll next by default
    if (count > 1 && !isInitialized) {
      setCanScrollNext(true);
    }
  }, [children, isInitialized]);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
      setIsInitialized(true);
    };

    // Initial update
    updateSelection();

    // Add a small delay to ensure the carousel has properly measured its content
    const initTimeout = setTimeout(() => {
      updateSelection();
    }, 100);

    // Listen for select events
    carouselApi.on('select', updateSelection);

    // Listen for resize events which might affect scrollability
    const handleResize = () => {
      updateSelection();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      carouselApi.off('select', updateSelection);
      window.removeEventListener('resize', handleResize);
      clearTimeout(initTimeout);
    };
  }, [carouselApi]);

  // Force update navigation state after component mounts
  useEffect(() => {
    if (carouselApi && itemCount > 1) {
      // Add a small delay to ensure the carousel has properly measured its content
      const timeout = setTimeout(() => {
        setCanScrollPrev(carouselApi.canScrollPrev());
        setCanScrollNext(carouselApi.canScrollNext());
      }, 200);

      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [carouselApi, itemCount]);

  return (
    <section className={`  ${className}`}>
      <div className="@xl:px-0 mx-auto  max-w-screen-xl px-0 [&:not(.px-6_&):not(.px-8_&):not(.px-10_&)]:px-6">
        <div className="@lg:mb-10 @md:mb-14 mb-6 flex items-end justify-end">
          <div className="@md:flex hidden shrink-0 gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-6" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-6" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: 'start',
            breakpoints: {
              '(max-width: 768px)': {
                dragFree: true,
              },
            },
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0 2xl:ml-[max(8rem,calc(50vw-700px))] 2xl:mr-[max(0rem,calc(50vw-700px))]">
            {children}
          </CarouselContent>
        </Carousel>
        {itemCount > 0 && (
          <div className="mt-8 flex items-center justify-center gap-1.5">
            {Array.from({ length: itemCount }).map((_, index) => {
              // Calculate distance from current slide (for sizing)
              const distance = Math.abs(currentSlide - index);
              // Calculate width based on distance (active is widest, gets smaller with distance)
              const width = distance === 0 ? 24 : Math.max(8 - distance * 1.5, 6);

              return (
                <button
                  key={index}
                  className={`h-2 min-w-2 rounded-full transition-all duration-300 ${
                    currentSlide === index ? 'bg-primary' : 'bg-secondary'
                  }`}
                  style={{ width: `${width}px` }}
                  onClick={() => carouselApi?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={currentSlide === index ? 'true' : 'false'}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
