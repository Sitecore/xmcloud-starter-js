'use client';

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
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { event } from '@sitecore-content-sdk/events';
import { cn } from '@/lib/utils';
import { getFieldValue } from '@/lib/component-props';
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

const CUSTOMERS_PHRASE = 'Our Customers';

const splitAttribution = (value: string) => {
  const [name, since] = value.split('|').map((part) => part.trim());
  return { name: name || '', since: since || '' };
};

const attributeFromXml = (xml: string, name: string) => {
  const match = xml.match(new RegExp(`${name}=["']([^"']*)["']`, 'i'));
  return match?.[1] || '';
};

const textValue = (value: unknown) => (typeof value === 'string' ? value : '');

const posterFromImage = (image: TestimonialCarouselItemProps['image']) => {
  const parsed = getFieldValue(image) as ImageField | undefined;
  const src = textValue(parsed?.value?.src) || attributeFromXml(image?.value || '', 'src');
  const alt = textValue(parsed?.value?.alt) || attributeFromXml(image?.value || '', 'alt');
  return { src, alt };
};

const reportVideoPlayed = (
  context: {
    isEditing: boolean;
    isPreview: boolean;
    language?: string;
    pageName?: string;
  },
  video: { href: string; name: string; duration: string }
) => {
  if (process.env.NODE_ENV === 'development' || context.isEditing || context.isPreview) {
    return;
  }

  try {
    void Promise.resolve(
      event({
        type: 'video-played',
        channel: 'WEB',
        ...(context.language ? { language: context.language.toUpperCase() } : {}),
        ...(context.pageName ? { page: context.pageName } : {}),
        extensionData: {
          videoUrl: video.href,
          videoTitle: video.name || video.href,
          ...(video.duration ? { duration: video.duration } : {}),
        },
      })
    ).catch(() => undefined);
  } catch {
    // Events are not initialized in development, editing, or preview.
  }
};

const mediaFromItem = (item: TestimonialCarouselItemProps) => {
  const attribution = getFieldValue(item.testimonialAttribution)?.value || '';
  const quote = getFieldValue(item.testimonialQuote)?.value || '';
  const poster = posterFromImage(item.image);
  const video = getFieldValue(item.videoLink) as LinkField | undefined;
  const { name, since } = splitAttribution(attribution);

  return {
    name,
    since,
    quote,
    src: poster.src,
    alt: poster.alt || name,
    href: video?.value?.href || '',
    duration: video?.value?.text || '',
  };
};

export const MediaCarousel: React.FC<TestimonialCarouselProps> = (props) => {
  const { fields } = props || {};
  const datasource = fields?.data?.datasource;
  const items = datasource?.children?.results ?? [];
  const { page } = useSitecore();
  const isEditing = page?.mode?.isEditing;
  const [index, setIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const titleField = getFieldValue(datasource?.title);
  const titleValue = typeof titleField?.value === 'string' ? titleField.value : '';
  const phraseIndex = titleValue.indexOf(CUSTOMERS_PHRASE);
  const activeIndex = items.length ? index % items.length : 0;
  const active = items[activeIndex] ? mediaFromItem(items[activeIndex]) : undefined;

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (media?.matches || !isAutoplay || isVideoOpen || items.length < 2) return;

    const timer = window.setInterval(() => {
      setIsVideoOpen(false);
      setIndex((current) => (current + 1) % items.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isAutoplay, isVideoOpen, items.length]);

  if (!fields?.data?.datasource) {
    return <NoDataFallback componentName="Testimonial Carousel" />;
  }

  const showSlide = (next: number) => {
    if (!items.length) return;
    setIsVideoOpen(false);
    setIndex((next + items.length) % items.length);
  };

  return (
    <section
      className={cn('bg-muted text-black py-14 md:py-16', props?.params?.styles)}
      data-testid="testimonial-media-carousel"
    >
      <div className="mx-auto max-w-6xl px-4">
        {isEditing ? (
          <Text
            tag="h2"
            field={titleField}
            className="font-heading mb-10 text-center text-3xl font-normal tracking-tight md:text-4xl"
          />
        ) : (
          <h2 className="font-heading mb-10 text-center text-3xl font-normal tracking-tight text-black md:text-4xl">
            {phraseIndex >= 0 ? (
              <>
                {titleValue.slice(0, phraseIndex)}
                <span className="font-bold">{CUSTOMERS_PHRASE}</span>
                {titleValue.slice(phraseIndex + CUSTOMERS_PHRASE.length)}
              </>
            ) : (
              titleValue
            )}
          </h2>
        )}

        <div className="flex items-center gap-3 md:gap-8">
          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-md"
            aria-label="Previous slide"
            onClick={() => showSlide(activeIndex - 1)}
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>

          <article className="grid min-w-0 flex-1 items-center gap-8 md:grid-cols-2">
            <div className="relative overflow-hidden bg-black/5">
              {isVideoOpen && active?.href ? (
                <video
                  key={active.href}
                  className="aspect-[16/10] w-full bg-black object-cover"
                  controls
                  autoPlay
                  poster={active.src}
                  src={active.href}
                />
              ) : (
                <button
                  type="button"
                  className="relative block w-full"
                  aria-label={active?.duration ? `Play video, ${active.duration}` : 'Play video'}
                  onClick={() => {
                    if (!active?.href) return;
                    setIsVideoOpen(true);
                    reportVideoPlayed(
                      {
                        isEditing: Boolean(page?.mode?.isEditing),
                        isPreview: Boolean(page?.mode?.isPreview),
                        language: page?.layout?.sitecore?.route?.itemLanguage,
                        pageName: page?.layout?.sitecore?.route?.name,
                      },
                      active
                    );
                  }}
                >
                  {active?.src ? (
                    <img
                      src={active.src}
                      alt={active.alt}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  ) : (
                    <span className="bg-muted block aspect-[16/10] w-full" />
                  )}
                  {active?.duration && (
                    <span className="absolute right-3 bottom-3 flex items-center gap-2 rounded-full bg-black px-3 py-1 text-sm text-white">
                      <Play className="h-3 w-3 fill-current" aria-hidden="true" />
                      {active.duration}
                    </span>
                  )}
                </button>
              )}
            </div>

            <div>
              {active?.name && (
                <p className="text-xl font-bold tracking-wide uppercase md:text-2xl">{active.name}</p>
              )}
              {active?.since && (
                <p className="mt-1 text-sm font-bold tracking-wide uppercase">{active.since}</p>
              )}
              {active?.quote && <p className="mt-6 text-base leading-relaxed md:text-lg">“{active.quote}”</p>}
            </div>
          </article>

          <button
            type="button"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-md"
            aria-label="Next slide"
            onClick={() => showSlide(activeIndex + 1)}
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {items.length > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-black px-3 py-2">
              <button
                type="button"
                className="text-white"
                aria-label={isAutoplay ? 'Stop automatic slide show' : 'Start automatic slide show'}
                onClick={() => setIsAutoplay((current) => !current)}
              >
                {isAutoplay ? (
                  <Pause className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                )}
              </button>
              {items.map((item, dotIndex) => (
                <button
                  key={item.id || dotIndex}
                  type="button"
                  aria-label={`Slide ${dotIndex + 1}`}
                  aria-current={dotIndex === activeIndex}
                  className={cn(
                    'rounded-full bg-white',
                    dotIndex === activeIndex ? 'h-2.5 w-2.5' : 'h-2 w-2 opacity-70'
                  )}
                  onClick={() => showSlide(dotIndex)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
