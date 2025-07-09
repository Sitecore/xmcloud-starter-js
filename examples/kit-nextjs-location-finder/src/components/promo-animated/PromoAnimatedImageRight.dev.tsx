import { useEffect, useState, useRef } from 'react';
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

export const PromoAnimatedImageRight: React.FC<PromoAnimatedProps> = (props) => {
  const { fields, params, isPageEditing } = props;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const imageRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // To avoid a horizontal scrollbar, check for the nearest full bleed wrapper,
    // and add "overflow:hidden" to its style
    const findContainerParent = (element: HTMLElement | null): HTMLElement | null => {
      while (element) {
        if (
          element.className.includes('container--full-bleed') ||
          element.tagName.toLowerCase() === 'main' ||
          element.tagName.toLowerCase() === 'body'
        ) {
          return element;
        }
        element = element.parentElement;
      }
      return null;
    };

    const containerParent = findContainerParent(wrapperRef.current);
    if (containerParent) {
      containerParent.style.overflow = 'hidden';
    }
  }, []);

  if (fields) {
    const { image, title, description, primaryLink, secondaryLink } = fields;

    const colorScheme = params.colorScheme as EnumValues<typeof ColorScheme>;
    const hasLinks = primaryLink?.value?.href || secondaryLink?.value?.href;

    return (
      <section ref={wrapperRef} className="promo-animated @container my-10">
        <div className="promo-animated__content-wrapper @md:grid-cols-2 @md:items-center @md:gap-10 @xl:gap-[135px] grid grid-cols-1">
          <div className="promo-animated__content @md:order-1 @md:flex @md:flex-col @md:justify-center @md:items-end min-w-0">
            {title && (
              <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
                <Text
                  tag="h2"
                  className="font-heading @sm:text-5xl @lg:text-6xl -ml-1 mt-6 max-w-[15.5ch] text-right text-4xl font-normal leading-[1.1333] tracking-tighter antialiased"
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
                  className="text-body text-secondary-foreground prose mt-6 max-w-[51.5ch] text-right text-lg tracking-tight antialiased"
                  field={description}
                />
              </AnimatedSection>
            )}

            {hasLinks && (
              <AnimatedSection
                delay={600}
                className="@md:mb-0 mb-6 mt-10 flex flex-wrap justify-end gap-2"
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

          <div className="promo-animated__image @md:flex @md:justify-start @md:order-2 w-full">
            {image && (
              <div
                className="@md:max-w-[452px] @xs:mx-0 relative mx-auto aspect-square h-full w-full max-w-[350px] rounded-r-full"
                ref={imageRef}
              >
                <div
                  className={imageBgOptions({
                    colorScheme,
                    className: 'left-1/2',
                  })}
                />
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
                    style={{
                      clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
                    }}
                  />
                </AnimatedSection>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Promo Animated: Image Right" />;
};
