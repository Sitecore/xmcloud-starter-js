import { useState, useEffect, useRef } from 'react';
import { RichText, Text } from '@sitecore-content-sdk/nextjs';
import { debounce } from 'radash';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { MultiPromoItemProps, MultiPromoProps } from './multi-promo.props';
import { Default as MultiPromoItem } from './MultiPromoItem.dev';

export const Default: React.FC<MultiPromoProps> = (props) => {
  const { fields, params } = props;
  const { numColumns } = params ?? {};
  const { children } = fields?.data?.datasource ?? {};
  const { title, description } = fields?.data?.datasource;
  const [api, setApi] = useState<CarouselApi>();
  const [announcement, setAnnouncement] = useState('');
  const carouselRef = useRef<HTMLDivElement>(null);

  // General slide handling
  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      const newIndex = api.selectedScrollSnap();

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
    rootNode.addEventListener('keydown', handleKeyDown);
    rootNode.addEventListener('wheel', debouncedHandleWheel);

    return () => {
      rootNode.removeEventListener('keydown', handleKeyDown);
      debouncedHandleKeyDown.cancel();
      rootNode.removeEventListener('wheel', debouncedHandleWheel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);

  if (fields) {
    return (
      <div
        className={cn('component multi-promo my-8 md:my-16', {
          [props?.params?.styles]: props?.params?.styles,
        })}
      >
        <div className="flex flex-col gap-4 group-[.is-inset]:px-4 sm:group-[.is-inset]:px-0 xl:flex-row xl:items-end xl:justify-between xl:gap-20">
          {title && (
            <div className="flex-grow md:basis-[60] lg:basis-[50]">
              <Text
                tag="h2"
                field={title?.jsonValue}
                className="font-heading text-box-trim-both-baseline -ml-1 max-w-[20ch] text-pretty text-4xl font-normal leading-[1.1333] tracking-tighter antialiased sm:text-5xl md:max-w-[17.5ch] lg:text-6xl"
              />
            </div>
          )}
          {description && (
            <div className="md:basis-[40] lg:basis-[50]">
              <RichText
                className="text-body prose text-box-trim-both-baseline mt-6 max-w-[51.5ch] text-pretty text-lg leading-[1.444] tracking-tight antialiased"
                field={description?.jsonValue}
              />
            </div>
          )}
        </div>
        {children && (
          <>
            <Carousel
              setApi={setApi}
              opts={{
                align: 'center',
                breakpoints: {
                  '(min-width: 640px)': { align: 'start' },
                },
                loop: true,
                skipSnaps: true,
              }}
              className="relative -ml-4 -mr-4 overflow-hidden sm:ml-0 sm:group-[.is-inset]:-mr-8 md:group-[.is-inset]:-mr-16
              2xl:group-[.is-inset]:-mr-24"
              ref={carouselRef}
            >
              <CarouselContent className="my-12 last:mb-0 sm:my-16 sm:-ml-8">
                {children?.results?.map((item: MultiPromoItemProps, index: number) => (
                  <CarouselItem
                    key={index}
                    className={cn(
                      'min-w-[238px] max-w-[416px] basis-3/4 pl-4 transition-opacity duration-300 sm:basis-[45%] sm:pl-8 md:basis-[31%]',
                      {
                        [`lg:basis-[31%]`]: numColumns === '3',
                        [`xl:basis-[23%]`]: numColumns === '4',
                      }
                    )}
                  >
                    <MultiPromoItem key={index} {...item} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {announcement}
            </div>
          </>
        )}
      </div>
    );
  }

  return <NoDataFallback componentName="Multi Promo" />;
};
