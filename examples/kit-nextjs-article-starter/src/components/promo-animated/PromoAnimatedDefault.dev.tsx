import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { PromoAnimatedProps } from './promo-animated.props';
import { EnumValues } from '@/enumerations/generic.enum';
import { ColorSchemeLimited as ColorScheme } from '@/enumerations/ColorSchemeLimited.enum';
import {
  animatedSpriteRenderingParams as spriteOptions,
  imageBgExtensionRenderingParams as imageBgOptions,
} from './promo-animated.util';

export const PromoAnimatedDefault: React.FC<PromoAnimatedProps> = (props) => {
  const { fields, params, isPageEditing } = props;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  if (fields) {
    const { image, title, description, primaryLink, secondaryLink } = fields;

    const colorScheme = params.colorScheme as EnumValues<typeof ColorScheme>;
    const hasLinks = isPageEditing || primaryLink?.value?.href || secondaryLink?.value?.href;

    return (
      <section data-component="PromoAnimated" className="@container">
        <div
          data-class-change
          className={cn(
            'promo-animated__content-wrapper @md:grid-cols-2 @md:items-center @md:gap-10 @xl:gap-[135px] group grid grid-cols-1',
            { [props?.params?.styles]: props?.params?.styles }
          )}
        >
          <div className="promo-animated__image @md:flex @md:justify-end w-full">
            {image && (
              <div
                className="@md:max-w-[452px] @xs:mx-0 relative mx-auto aspect-square h-full w-full max-w-[350px] rounded-r-full group-[.position-center]:mx-auto group-[.position-right]:ml-auto"
                ref={imageRef}
              >
                <div className={imageBgOptions({ colorScheme, className: 'right-1/2' })} />
                <ImageWrapper
                  image={image}
                  className="@md:max-w-[452px] aspect-square w-full rounded-full object-cover"
                  wrapperClass="relative aspect-square w-full"
                  sizes="(min-width: 768px) 452px, 350px"
                  priority={true}
                />
                <AnimatedSection
                  animationType="rotate"
                  className="pointer-events-none absolute bottom-0 aspect-square h-full w-full rotate-0"
                  divWithImage={imageRef}
                  reducedMotion={prefersReducedMotion}
                  isPageEditing={isPageEditing}
                >
                  <div
                    className={spriteOptions({ colorScheme })}
                    style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
                  />
                </AnimatedSection>
              </div>
            )}
          </div>

          <div className="promo-animated__content @md:flex @md:flex-col @md:justify-center @md:items-start min-w-0">
            {title && (
              <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
                <Text
                  tag="h2"
                  className="font-heading @sm:text-5xl @lg:text-6xl -ml-1 mt-6 max-w-[15.5ch] text-4xl font-normal leading-[1.1333] tracking-tighter group-[.position-center]:mx-auto group-[.position-right]:ml-auto"
                  field={title}
                />
              </AnimatedSection>
            )}

            {description && (
              <AnimatedSection
                delay={300}
                reducedMotion={prefersReducedMotion}
                isPageEditing={isPageEditing}
              >
                <RichText
                  className="text-body text-secondary-foreground prose mt-6 max-w-[51.5ch] text-lg tracking-tight group-[.position-center]:mx-auto group-[.position-right]:ml-auto"
                  field={description}
                />
              </AnimatedSection>
            )}

            {hasLinks && (
              <AnimatedSection
                delay={600}
                className="@md:mb-0 mb-6 mt-10 flex w-full flex-wrap gap-2 group-[.position-right]:justify-end group-[.position-center]:justify-center"
                reducedMotion={prefersReducedMotion}
                isPageEditing={isPageEditing}
              >
                {primaryLink && (
                  <Button buttonLink={primaryLink} isPageEditing={isPageEditing}></Button>
                )}
                {secondaryLink && (
                  <Button
                    variant="secondary"
                    buttonLink={secondaryLink}
                    isPageEditing={isPageEditing}
                  ></Button>
                )}
              </AnimatedSection>
            )}
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Promo Animated" />;
};
