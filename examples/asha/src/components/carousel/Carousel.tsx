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

type CarouselLayout = 'default' | 'ctaLeft' | 'version2';

const imageTone = (params: CarouselsProps['params']) => (params?.ImageTone || '').trim().toLowerCase();

const WellnessMark = ({ light = false }: { light?: boolean }): JSX.Element => (
  <svg
    aria-hidden="true"
    viewBox="0 0 32 42"
    className={cn('mx-auto mb-3 h-10 w-8', light ? 'text-foreground' : 'text-white')}
  >
    <path
      fill="currentColor"
      d="M16.2 1.2c.2 1.4.1 2.8-.2 4.1-1.6 6.2-6.4 9.6-10.2 13.1C2.4 21.4.8 24.6.8 28.2c0 6.4 5.2 11.2 12.2 12.4.5 1.5 1.6 2.4 3.2 2.4s2.7-.9 3.2-2.4c7-1.2 12.2-6 12.2-12.4 0-3.6-1.6-6.8-5-9.8-3.8-3.5-8.6-6.9-10.2-13.1-.3-1.3-.4-2.7-.2-4.1z"
    />
    <path
      d="M16.2 10.5v22"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.55"
      strokeWidth="1.15"
    />
  </svg>
);

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
  const tone = imageTone(props.params);
  const isLightImage = tone === 'light';
  const isDarkImage = tone === 'dark';

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
  const callToAction = getFieldValue(activeSlide.callToAction);

  if (layout === 'version2') {
    return (
      <div
        ref={carouselRef}
        className={cn('relative w-full', props.params.styles)}
        data-class-change
        data-carousel-layout="version2"
        data-image-tone={isLightImage ? 'light' : 'dark'}
        aria-roledescription="carousel"
        aria-label="Featured slides"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <div className="relative h-[20rem] w-full overflow-hidden sm:h-[24rem] lg:h-[26.5rem]">
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
                    className="h-full w-full object-cover object-[70%_center]"
                  />
                </div>
                <div className="absolute inset-y-0 left-0 flex w-full items-center justify-center px-16 md:w-1/2 md:px-10">
                  <div
                    className={cn(
                      'max-w-[18.5rem] text-center',
                      isLightImage ? 'text-foreground' : 'text-white'
                    )}
                  >
                    <WellnessMark light={isLightImage} />
                    <h2
                      className={cn(
                        'mx-auto max-w-[16.5rem] font-heading text-[1.7rem] font-medium leading-[1.15] sm:text-[2.15rem]',
                        isLightImage ? 'text-foreground' : 'text-white'
                      )}
                    >
                      <ContentSdkText field={slideTitle} />
                    </h2>
                    <p
                      className={cn(
                        'mx-auto mb-5 mt-3 max-w-[17.5rem] text-sm font-normal leading-snug',
                        isLightImage ? 'text-foreground' : 'text-white'
                      )}
                    >
                      <ContentSdkText field={getFieldValue(activeSlide.bodyText)} />
                    </p>
                    {callToAction?.value?.href && (
                      <Button
                        variant={isLightImage ? 'default' : 'rounded-white'}
                        className={cn(
                          'h-auto rounded-full px-6 py-2.5 text-xs font-medium uppercase tracking-[0.14em] shadow-sm',
                          isLightImage
                            ? 'bg-foreground text-white hover:bg-foreground hover:text-white'
                            : 'bg-white text-primary hover:bg-white hover:text-primary'
                        )}
                        asChild
                      >
                        <ContentSdkLink
                          field={callToAction}
                          className={cn(
                            'inline-flex items-center uppercase tracking-[0.14em]',
                            isLightImage ? 'text-white' : 'text-primary'
                          )}
                          prefetch={false}
                        />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={goToPrevSlide}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-colors hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.25} />
          </button>
          <button
            type="button"
            onClick={goToNextSlide}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-md transition-colors hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.25} />
          </button>

          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2">
            <div className="flex items-center gap-2.5 rounded-full bg-black/80 px-3 py-1.5">
              <button
                type="button"
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause carousel' : 'Play carousel'}
                className="flex h-5 w-5 items-center justify-center text-white"
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" strokeWidth={2.5} />
                ) : (
                  <Play className="h-3.5 w-3.5" strokeWidth={2.5} />
                )}
              </button>
              <div className="flex items-center gap-1.5" role="tablist" aria-label="Slide selection">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id || `indicator-${index}`}
                    type="button"
                    onClick={() => goToSlide(index, index > currentSlide ? 1 : -1)}
                    aria-label={`Go to slide ${index + 1} of ${slides.length}`}
                    aria-selected={currentSlide === index}
                    role="tab"
                    data-testid="carousel-dot-indicator"
                    className="inline-flex h-4 w-4 items-center justify-center"
                  >
                    <span
                      className={cn(
                        'block rounded-full bg-white transition-all',
                        currentSlide === index ? 'h-2 w-2' : 'h-1.5 w-1.5 opacity-80'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={carouselRef}
      className={cn('relative w-full', props.params.styles)}
      data-class-change
      data-carousel-layout={layout}
      data-image-tone={isLightImage ? 'light' : isDarkImage ? 'dark' : undefined}
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
                  isLightImage
                    ? 'bg-gradient-to-r from-white/55 via-white/20 to-transparent'
                    : isCtaLeft
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
                  <div
                    className={cn(
                      isCtaLeft && 'max-w-xl text-left',
                      (isCtaLeft || isDarkImage) && !isLightImage && 'text-white',
                      isLightImage && 'text-foreground'
                    )}
                  >
                    <h2
                      className={cn(
                        'mb-4 font-bold',
                        isCtaLeft
                          ? 'text-4xl leading-tight md:text-5xl lg:text-6xl'
                          : 'text-3xl',
                        isLightImage
                          ? 'text-foreground'
                          : isCtaLeft || isDarkImage
                            ? 'text-white'
                            : undefined
                      )}
                    >
                      <ContentSdkText field={getFieldValue(activeSlide.title)} />
                    </h2>
                    <p
                      className={cn(
                        'mb-6',
                        isCtaLeft && 'max-w-md text-base leading-relaxed md:text-lg',
                        isLightImage && 'text-foreground [&_span]:text-foreground',
                        !isLightImage &&
                          (isCtaLeft || isDarkImage) &&
                          'text-white [&_span]:text-white'
                      )}
                    >
                      <ContentSdkText field={getFieldValue(activeSlide.bodyText)} />
                    </p>
                    <Button
                      variant={isLightImage ? 'default' : isDarkImage ? 'rounded-white' : 'default'}
                      size={isCtaLeft ? 'default' : 'lg'}
                      className={cn(
                        isCtaLeft ? 'px-6 py-2.5 font-semibold' : 'bold py-3 text-lg',
                        isLightImage && 'bg-foreground text-white hover:bg-foreground hover:text-white',
                        isDarkImage && 'bg-white text-primary hover:bg-white hover:text-primary'
                      )}
                      asChild
                    >
                      <ContentSdkLink
                        field={getFieldValue(activeSlide.callToAction)!}
                        className={cn(
                          'inline-flex items-center',
                          isCtaLeft ? 'text-sm' : 'py-2 text-lg',
                          isLightImage && 'text-white',
                          isDarkImage && 'text-primary'
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

export const Version2 = (props: CarouselsProps): JSX.Element => (
  <CarouselView props={props} layout="version2" />
);
