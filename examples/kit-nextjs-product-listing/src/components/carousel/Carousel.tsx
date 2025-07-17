/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import {
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  Text as ContentSdkText,
} from '@sitecore-content-sdk/nextjs';
import { IGQLImageField, IGQLLinkField, IGQLTextField } from 'src/types/igql';
import { useEffect, useMemo, useRef, useState, type JSX } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from 'lib/utils';

interface Fields {
  data: {
    datasource: {
      children: {
        results: CarouselFields[];
      };
      title: IGQLTextField;
      tagLine: IGQLTextField;
    };
  };
}

interface CarouselFields {
  id: string;
  callToAction: IGQLLinkField;
  title: IGQLTextField;
  bodyText: IGQLTextField;
  slideImage: IGQLImageField;
}

type CarouselsProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: CarouselsProps): JSX.Element => {
  const datasource = useMemo(() => props.fields.data.datasource, [props.fields.data.datasource]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const carouselRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  const slides = useMemo(() => datasource.children.results, [datasource.children.results]);

  useEffect(() => {
    if (!isPlaying || isFocused) {
      return;
    }

    const interval = setInterval(() => {
      goToNextSlide();
    }, 15000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, isFocused]);

  // Handle keyboard navigation
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
  }, [currentSlide]);

  const goToSlide = (index: number, dir: number) => {
    setDirection(dir);
    setCurrentSlide(index);
    // Focus the slide for screen readers after animation completes
    setTimeout(() => {
      // slideRefs.current[index]?.focus();
    }, 900);
  };

  const goToNextSlide = () => {
    const newIndex = (currentSlide + 1) % slides.length;
    goToSlide(newIndex, 1);
  };

  const goToPrevSlide = () => {
    const newIndex = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(newIndex, -1);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Animation variants
  const slideVariants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? '100%' : '-100%',
        opacity: 1, // Start fully opaque to prevent white flash
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => {
      return {
        x: direction < 0 ? '100%' : '-100%',
        opacity: 1, // Stay fully opaque to prevent white flash
      };
    },
  };

  // Simpler fade animation for users who prefer reduced motion
  const fadeVariants = {
    enter: { opacity: 0 },
    center: { opacity: 1 },
    exit: { opacity: 0 },
  };

  // Use appropriate animation based on user preference
  const variants = prefersReducedMotion ? fadeVariants : slideVariants;

  return (
    <div
      ref={carouselRef}
      className={`relative w-full ${props.params.styles}`}
      data-class-change
      aria-roledescription="carousel"
      aria-label="Sustainability initiatives carousel"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    >
      {/* Carousel slides container */}
      <div className="relative w-full overflow-hidden bg-white" style={{ height: '500px' }}>
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
              aria-label={`Slide ${currentSlide + 1} of ${slides.length}: ${
                slides[currentSlide].title
              }`}
              tabIndex={0}
              role="group"
            >
              {/* Full-size background image */}
              <div className="absolute inset-0 h-full w-full">
                <ContentSdkImage
                  field={slides[currentSlide].slideImage?.jsonValue}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Gradient overlay to ensure text readability */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/40"
                aria-hidden="true"
              />

              {/* Text content overlay - positioned on the right side */}
              <div className="absolute inset-y-0 right-0 flex w-full items-center justify-end md:w-1/2 lg:w-2/5">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="p-8 md:p-10"
                >
                  <h2 className="mb-4 text-3xl font-bold">
                    <ContentSdkText field={slides[currentSlide].title?.jsonValue} />
                  </h2>
                  <p className="mb-6">
                    <ContentSdkText field={slides[currentSlide].bodyText?.jsonValue} />
                  </p>
                  <Button size="lg" className="bold py-3 text-lg" asChild>
                    <ContentSdkLink
                      field={slides[currentSlide].callToAction?.jsonValue}
                      className="inline-flex items-center py-2 text-lg"
                      prefetch={false}
                    />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel controls - Positioned below the slides */}
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

        {/* Slide indicators */}
        <div className="flex gap-2" role="tablist" aria-label="Slide selection">
          {slides.map((_, index) => (
            <button
              key={`indicator-${index}`}
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
    </div>
  );
};
