'use client';

/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from 'lib/utils';
import type { CarouselDatasourceFields, CarouselFields, CarouselsProps } from './carousel.props';
import { getDatasource, getFieldValue } from '@/lib/component-props';

type CarouselLayout = 'default' | 'ctaLeft';

const getSlideItems = (datasource: CarouselDatasourceFields | undefined): CarouselFields[] => {
  const children = datasource?.children;
  if (!children) {
    return [];
  }

  const raw = Array.isArray(children) ? children : (children.results ?? children.nodes ?? []);

  return raw.filter((slide): slide is CarouselFields => Boolean(slide));
};

const CarouselFallback = (): JSX.Element => (
  <div className="component carousel">
    <div className="component-content">
      <span className="is-empty-hint">Carousel</span>
    </div>
  </div>
);

const CarouselView = ({
  props,
  layout,
}: {
  props: CarouselsProps;
  layout: CarouselLayout;
}): JSX.Element => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [direction, setDirection] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isCtaLeft = layout === 'ctaLeft';

  const slides = useMemo(() => getSlideItems(datasource), [datasource]);

  const goToSlide = (index: number, dir: number) => {
    setDirection(dir);
    setCurrentSlide(index);
    setTimeout(() => {
      // slideRefs.current[index]?.focus();
    }, 900);
  };

  const goToNextSlide = () => {
    if (slides.length === 0) return;
    const newIndex = (currentSlide + 1) % slides.length;
    goToSlide(newIndex, 1);
  };

  const goToPrevSlide = () => {
    if (slides.length === 0) return;
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(newIndex, -1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (!isPlaying || isFocused || slides.length === 0) {
      return;
    }

    const interval = setInterval(() => {
      goToNextSlide();
    }, 15000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, isFocused, slides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carouselRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0, currentSlide > 0 ? -1 : 0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(slides.length - 1, currentSlide < slides.length - 1 ? 1 : 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 1,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100%' : '-100%',
      opacity: 1,
    }),
  };

  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const variants = prefersReducedMotion ? fadeVariants : slideVariants;

  if (!datasource || slides.length === 0) {
    return <CarouselFallback />;
  }

  const activeSlide = slides[currentSlide];
  const slideTitle = getFieldValue(activeSlide.title);

  return (
    <div
      ref={carouselRef}
      className={cn('relative w-full', props.params.styles)}
      data-class-change
      data-carousel-layout={layout}
      aria-roledescription="carousel"
      aria-label="Sustainability initiatives carousel"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      <div
        className={cn(
          'relative w-full overflow-hidden',
          isCtaLeft ? 'min-h-[32rem] bg-foreground md:min-h-[36rem] lg:min-h-[40rem]' : 'bg-white'
        )}
        style={isCtaLeft ? undefined : { height: '500px' }}
      >
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 100, damping: 20, duration: 0.8 },
              opacity: { duration: 0.5 },
            }}
            className="absolute left-0 top-0 h-full w-full"
          >
            <div
              ref={(el) => {
                slideRefs.current[currentSlide] = el;
              }}
              className="relative h-full w-full"
              aria-roledescription="slide"
              aria-label={`Slide ${currentSlide + 1} of ${slides.length}: ${slideTitle?.value ?? ''}`}
              tabIndex={0}
              role="group"
            >
              <div className="absolute inset-0 h-full w-full">
                <ContentSdkImage
                  field={getFieldValue(activeSlide.slideImage)}
                  className="h-full w-full object-cover"
                />
              </div>

              <div
                className={cn(
                  'absolute inset-0',
                  isCtaLeft
                    ? 'bg-gradient-to-r from-foreground/55 via-foreground/20 to-transparent'
                    : 'bg-gradient-to-r from-black/10 to-black/40'
                )}
                aria-hidden="true"
              />

              <div
                className={cn(
                  'absolute inset-0 flex',
                  isCtaLeft
                    ? 'items-center justify-start'
                    : 'inset-y-0 right-0 w-full items-center justify-end md:left-auto md:w-1/2 lg:w-2/5'
                )}
              >
                <motion.div
                  initial={{ opacity: 0, x: isCtaLeft ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className={cn(
                    isCtaLeft
                      ? 'w-full max-w-7xl px-6 py-16 text-left md:px-12 lg:px-16'
                      : 'p-8 md:p-10'
                  )}
                >
                  <div className={cn(isCtaLeft && 'max-w-xl text-left text-white')}>
                    <h2
                      className={cn(
                        'mb-4 font-bold',
                        isCtaLeft
                          ? 'text-4xl leading-tight text-white md:text-5xl lg:text-6xl'
                          : 'text-3xl'
                      )}
                    >
                      <ContentSdkText field={getFieldValue(activeSlide.title)} />
                    </h2>
                    <p
                      className={cn(
                        'mb-6',
                        isCtaLeft &&
                          'max-w-md text-base leading-relaxed text-white md:text-lg [&_span]:text-white'
                      )}
                    >
                      <ContentSdkText field={getFieldValue(activeSlide.bodyText)} />
                    </p>
                    <Button
                      size={isCtaLeft ? 'default' : 'lg'}
                      className={cn(isCtaLeft ? 'px-6 py-2.5 font-semibold' : 'bold py-3 text-lg')}
                      asChild
                    >
                      <ContentSdkLink
                        field={getFieldValue(activeSlide.callToAction)!}
                        className={cn(
                          'inline-flex items-center',
                          isCtaLeft ? 'text-sm' : 'py-2 text-lg'
                        )}
                        prefetch={false}
                      />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>

      {isCtaLeft && (
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2"
        >
          <div
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-foreground/55 px-3 py-2 shadow-md backdrop-blur-sm"
            role="tablist"
            aria-label={`Slide selection, ${slides.length} slides`}
          >
            {slides.map((slide, index) => (
              <button
                key={slide.id || `indicator-${index}`}
                type="button"
                onClick={() => goToSlide(index, index > currentSlide ? 1 : -1)}
                aria-label={`Go to slide ${index + 1} of ${slides.length}`}
                aria-selected={currentSlide === index}
                role="tab"
                data-testid="carousel-dash-indicator"
                className="inline-flex h-4 shrink-0 items-center justify-center"
              >
                <span
                  className={cn(
                    'block h-1 rounded-full shadow-sm transition-all',
                    currentSlide === index ? 'w-8 bg-white' : 'w-5 bg-white/70 hover:bg-white'
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {!isCtaLeft && (
        <div className="flex items-center justify-center gap-4 bg-white py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
            className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevSlide}
            aria-label="Previous slide"
            className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex gap-2" role="tablist" aria-label="Slide selection">
            {slides.map((_, index) => (
              <button
                key={`indicator-${index}`}
                type="button"
                onClick={() => goToSlide(index, index > currentSlide ? 1 : -1)}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={currentSlide === index}
                role="tab"
                className={cn(
                  'h-2 w-2 rounded-full transition-all',
                  currentSlide === index ? 'bg-gray-900' : 'bg-gray-400 hover:bg-gray-600'
                )}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextSlide}
            aria-label="Next slide"
            className="h-8 w-8 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export const Default = (props: CarouselsProps): JSX.Element => (
  <CarouselView props={props} layout="default" />
);

export const CTALeft = (props: CarouselsProps): JSX.Element => (
  <CarouselView props={props} layout="ctaLeft" />
);
