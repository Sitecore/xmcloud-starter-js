import { useState, useEffect } from 'react';
import { Text, useSitecore } from '@sitecore-content-sdk/nextjs';
import { cva } from 'class-variance-authority';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { Button } from '@/components/ui/button';
import { Default as MediaSection } from '@/components/media-section/MediaSection.dev';
import { HeroProps } from './hero.props';

// Define heroVariants using class-variance-authority for styling
export const heroVariants = cva('hero @container py-24 relative w-full overflow-hidden', {
  variants: {
    colorScheme: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-primary',
      tertiary: 'bg-tertiary text-primary',
      dark: 'bg-dark text-primary',
      light: 'bg-light text-primary',
    },
  },
  defaultVariants: {
    colorScheme: 'light',
  },
});

export const Default: React.FC<HeroProps> = ({ fields, params }) => {
  // Destructure fields and params

  const {
    titleRequired,
    descriptionOptional,
    linkOptional,
    heroVideoOptional1,
    heroImageOptional1,
    heroVideoOptional2,
    heroImageOptional2,
    heroVideoOptional3,
    heroImageOptional3,
    heroVideoOptional4,
    heroImageOptional4,
  } = fields;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  const { colorScheme } = params;
  // Use custom hook to match media queries
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    setIsPlaying(!mediaQuery.matches);
  }, []);

  if (fields) {
    return (
      <section className={cn(heroVariants({ colorScheme }), [params?.styles && params.styles])}>
        <div className="grid gap-20">
          {/* Hero content */}
          <div className="mx-auto w-full max-w-screen-xl px-4 xl:px-8">
            <AnimatedSection
              direction="up"
              className="@lg:flex-row @lg:items-center @lg:gap-10 flex flex-col items-stretch gap-3"
              isPageEditing={isPageEditing}
            >
              {(titleRequired?.value || isPageEditing) && (
                <Text
                  tag="h1"
                  field={titleRequired}
                  className="font-heading @lg:text-8xl @lg:leading-[90px] basis-1/2 text-5xl font-normal leading-[60px]"
                />
              )}
              <div className="@lg:gap-10 flex basis-1/2  flex-col gap-8 ">
                {(descriptionOptional?.value || isPageEditing) && (
                  <Text
                    tag="p"
                    className={cn(
                      'font-body line-height-[26px] text-medium font-base @md:text-xl text-lg',
                      {
                        'text-primary-foreground': colorScheme === 'primary',
                        'text-secondary-foreground': colorScheme !== 'primary',
                      }
                    )}
                    field={descriptionOptional}
                  />
                )}
                {linkOptional && (
                  <div>
                    <EditableButton
                      buttonLink={linkOptional}
                      className={
                        colorScheme === 'primary' ? 'text-primary bg-white hover:bg-gray-100' : ''
                      }
                      isPageEditing={isPageEditing}
                    />
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
          {/* Hero image/video sections */}
          <div className="relative flex items-center justify-center overflow-x-hidden">
            <div className="@lg:gap-8 @lg:min-w-[120%] mx-auto flex min-w-[110%]  items-start gap-4 px-4">
              <div className="shrink-0 grow-0 basis-1/4">
                <MediaSection
                  video={heroVideoOptional1?.value?.href}
                  image={heroImageOptional1}
                  className="aspect-280/356 relative"
                  pause={!isPlaying}
                  reducedMotion={isPageEditing || prefersReducedMotion}
                />
              </div>
              <div className="shrink-0 grow-0 basis-1/4">
                <MediaSection
                  video={heroVideoOptional2?.value?.href}
                  image={heroImageOptional2}
                  className="aspect-280/196 relative"
                  pause={!isPlaying}
                  reducedMotion={isPageEditing || prefersReducedMotion}
                />
              </div>
              <div className="shrink-0 grow-0 basis-1/4">
                <MediaSection
                  video={heroVideoOptional3?.value?.href}
                  image={heroImageOptional3}
                  className="aspect-280/356 relative"
                  pause={!isPlaying}
                  reducedMotion={isPageEditing || prefersReducedMotion}
                />
              </div>
              <div className="shrink-0 grow-0 basis-1/4">
                <MediaSection
                  video={heroVideoOptional4?.value?.href}
                  image={heroImageOptional4}
                  className="aspect-280/356 relative"
                  pause={!isPlaying}
                  reducedMotion={isPageEditing || prefersReducedMotion}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Play/Pause button - A11y */}
        {!prefersReducedMotion && (
          <Button
            variant="link"
            size="icon"
            onClick={() => setIsPlaying((previousState) => !previousState)}
            className="absolute bottom-2 right-2"
            aria-label={isPlaying ? 'Pause Ambient Video' : 'Play Ambient'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
        )}
      </section>
    );
  }

  return <NoDataFallback componentName="Hero" />;
};
