import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { PromoImageProps } from './promo-image.props';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { useMatchMedia } from '@/hooks/use-match-media';

export const PromoTitlePartialOverlay: React.FC<PromoImageProps> = (props) => {
  const { fields, isPageEditing } = props;
  const prefersReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');

  if (fields) {
    const { image, heading, description, link } = fields;
    const hasLink = isPageEditing || link?.value?.href;

    return (
      <section
        data-component="Promo Image"
        className="@container @md:py-20 bg-background relative w-full overflow-hidden border-b-2 border-t-2 py-20 [.border-b-2+&]:border-t-0"
      >
        <div className="@xl:absolute @md:translate-y-1 relative z-10 w-full">
          <div className="@md:w-1/2 @md:max-w-[520px] mx-auto w-full">
            {(isPageEditing || heading?.value) && (
              <AnimatedSection
                direction="right"
                className=" relative mx-auto w-full"
                isPageEditing={isPageEditing}
                reducedMotion={prefersReducedMotion}
                delay={600}
              >
                <Text
                  tag="h2"
                  className="font-heading @md:text-6xl text-primary-foreground text-pretty text-5xl"
                  field={heading}
                />
              </AnimatedSection>
            )}
          </div>
        </div>
        <div className="@md:grid-cols-2 @xl:pl-0 relative z-0 mx-auto grid max-w-screen-2xl grid-cols-1 items-end gap-0 px-8">
          <div>
            {(isPageEditing || image?.value?.src) && (
              <AnimatedSection
                direction="up"
                className=" -z-1 @sm:h-[400px] @md:h-auto @md:aspect-[733/482] @md:-mt-6 h-[300px] w-full "
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
          </div>
          <div>
            {(hasLink || description?.value) && (
              <div className="@md:mt-[51px] @md:ml-auto @md:pl-20 @lg:mb-20 mt-6">
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
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Promo Image: Middle" />;
};
