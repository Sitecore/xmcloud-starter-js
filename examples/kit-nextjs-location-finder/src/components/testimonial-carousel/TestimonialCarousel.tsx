import { useState, useEffect, useRef, useCallback, MouseEvent } from 'react';
import { debounce } from 'radash';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import {
  TestimonialCarouselItemProps,
  TestimonialCarouselProps,
} from './testimonial-carousel.props';
import { Default as TestimonialCarouselItem } from './TestimonialCarouselItem';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<TestimonialCarouselProps> = (props) => {
  const { fields } = props || {};
  const { children } = fields?.data?.datasource ?? {};
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showNext, setShowNext] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false); // Added focus state

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedMouseMove = useCallback(
    debounce({ delay: 100 }, (event: MouseEvent<HTMLDivElement>) => {
      if (carouselRef.current) {
        const { left, width } = carouselRef.current.getBoundingClientRect();
        const mouseX = event.clientX - left;
        const threshold = width / 4; // 25% from each side

        setShowPrevious(mouseX < threshold);
        setShowNext(mouseX > width - threshold);
      }
    }),
    []
  );

  const handleMouseMove = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      debouncedMouseMove(event);
    },
    [debouncedMouseMove]
  );

  const handleMouseLeave = useCallback(() => {
    setShowPrevious(false);
    setShowNext(false);
  }, []);

  useEffect(() => {
    if (!api || !isFocused) return; // Only apply keyboard navigation when focused

    api.on('select', () => {
      const newIndex = api.selectedScrollSnap();
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());

      // Announce slide change
      setAnnouncement(`Slide ${newIndex + 1} of ${children?.results.length}`);
    });

    // Add mousewheel event listener and keyboard event listener
    const debouncedHandleWheel = debounce({ delay: 100 }, (event: WheelEvent) => {
      if (event.deltaX > 0) {
        api.scrollNext();
      } else if (event.deltaX < 0) {
        api.scrollPrev();
      }
    });

    const debouncedHandleKeyDown = debounce({ delay: 100 }, (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        api?.scrollPrev();
      } else if (event.key === 'ArrowRight') {
        api?.scrollNext();
      }
    });
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); // Prevent default scrolling behavior
        debouncedHandleKeyDown(event);
      }
    };

    const rootNode = api.rootNode();
    window.addEventListener('keydown', handleKeyDown);
    rootNode.addEventListener('wheel', debouncedHandleWheel);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      debouncedHandleKeyDown.cancel(); // Cancel any pending debounced calls
      rootNode.removeEventListener('wheel', debouncedHandleWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, isFocused]);
  if (fields) {
    return (
      <div
        className={cn(
          '@container component testimonial-carousel text-secondary-foreground @md:px-6 @lg:px-0 overflow-hidden rounded-[24px]',
          { [`${props?.params?.styles}`]: props?.params?.styles }
        )}
        ref={carouselRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsFocused(true)} // Added focus handler
        onBlur={() => setIsFocused(false)} // Added blur handler
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0} // Added tabIndex
      >
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="@md:-ml-4 -ml-2">
            {children?.results?.map((item: TestimonialCarouselItemProps, index: number) => (
              <CarouselItem
                key={index}
                className={cn(
                  '@lg:basis-3/4 @md:basis-4/5 @md:pl-4 py-[70px] transition-opacity duration-300'
                )}
              >
                <TestimonialCarouselItem key={index} {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            variant={'default'}
            className={cn(
              '@md:h-[58px] @md:w-[58px] @md:[&_svg]:size-10 @lg:h-[116px] @lg:w-[116px] absolute top-1/2 h-[40px] w-[40px] -translate-y-1/2 rounded-full transition-all duration-300 [&_svg]:size-4',
              showPrevious ? '@md:left-[70px] @lg:left-[140px] left-[35px]' : '-left-[116px]',
              canScrollPrev
                ? 'opacity-100'
                : ' disabled:bg-primary/30 cursor-not-allowed opacity-50'
            )}
            onFocus={() => setShowPrevious(true)}
            onBlur={() => setShowPrevious(false)}
            disabled={!canScrollPrev}
          />

          <CarouselNext
            variant={'default'}
            className={cn(
              '@md:h-[58px] @md:w-[58px] @md:[&_svg]:size-10 @lg:h-[116px] @lg:w-[116px] absolute top-1/2 h-[40px] w-[40px] -translate-y-1/2 rounded-full transition-all duration-300 [&_svg]:size-4',
              showNext ? '@md:right-[70px] @lg:right-[140px] right-[35px]' : '-right-[116px]',
              canScrollNext
                ? 'opacity-100'
                : ' disabled:bg-primary/30 cursor-not-allowed opacity-50'
            )}
            onFocus={() => setShowNext(true)}
            onBlur={() => setShowNext(false)}
            disabled={!canScrollNext}
          />
        </Carousel>
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="Testimonial Carousel" />;
};
