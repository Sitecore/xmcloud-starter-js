import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { PromoImageProps } from './promo-image.props';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { useMatchMedia } from '@/hooks/use-match-media';

export const PromoImageMiddle: React.FC<PromoImageProps> = (props) => {
  const { fields, isPageEditing } = props;
  const prefersReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');

  if (fields) {
    const { image, heading, description, link } = fields;
    const hasLink = isPageEditing || link?.value?.href;

    return (
      <section
        data-component="Promo Image"
        className="@container @md:py-20 relative w-full overflow-hidden border-b-2 border-t-2 bg-black py-20 [.border-b-2+&]:border-t-0"
      >
        <div className="relative mx-auto max-w-screen-xl px-8">
          {(isPageEditing || heading?.value) && (
            <AnimatedSection
              direction="right"
              className="@md:max-w-[45%] @md:z-10 @md:translate-y-1 relative"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
              delay={600}
            >
              <Text
                tag="h2"
                className="font-heading @xs:text-3xl @sm:text-4xl @lg:text-5xl text-primary-foreground text-pretty text-2xl"
                field={heading}
              />
            </AnimatedSection>
          )}

          {(isPageEditing || image?.value?.src) && (
            <AnimatedSection
              direction="up"
              className="@sm:h-[400px] @md:h-auto @md:aspect-[1164/482] @md:-mt-6 h-[300px] w-full"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
            >
              <ImageWrapper
                image={image}
                className="h-full w-full object-cover"
                wrapperClass="w-full h-full"
              />
            </AnimatedSection>
          )}
          {(hasLink || description?.value) && (
            <div className="@md:mt-[51px] @md:ml-auto @md:max-w-[55%] mt-6">
              {description && (
                <AnimatedSection
                  direction="left"
                  isPageEditing={isPageEditing}
                  reducedMotion={prefersReducedMotion}
                  delay={900}
                >
                  <RichText
                    className="@md:mt-0 text-primary-foreground @xs:text-lg @md:text-xl mt-6 font-normal tracking-tight antialiased"
                    field={description}
                  />
                </AnimatedSection>
              )}

              {hasLink && (
                <AnimatedSection
                  direction="left"
                  isPageEditing={isPageEditing}
                  reducedMotion={prefersReducedMotion}
                  delay={1200}
                >
                  <div className="mt-6">
                    <Button buttonLink={link} isPageEditing={isPageEditing}></Button>
                  </div>
                </AnimatedSection>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Promo Image: Middle" />;
};
