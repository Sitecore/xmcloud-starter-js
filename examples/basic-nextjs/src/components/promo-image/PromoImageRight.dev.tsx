import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { PromoImageProps } from './promo-image.props';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { useMatchMedia } from '@/hooks/use-match-media';
export const PromoImageRight: React.FC<PromoImageProps> = (props) => {
  const { fields, isPageEditing } = props;

  const prefersReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');

  if (fields) {
    const { image, heading, description, link } = fields;
    const hasLink = isPageEditing || link?.value?.href;

    return (
      <section
        data-component="Promo Image"
        className="@container relative w-full overflow-hidden border-b-2 border-t-2 [.border-b-2+&]:border-t-0"
      >
        <div className="@md:flex-row @md:min-h-[500px] flex flex-col">
          <div className="@md:w-1/2 @[1216px]:pl-0 @lg:px-12  @[1216px]:pr-[113px] text-primary-foreground flex w-full flex-col justify-center px-8 py-12">
            <div className="">
              {/* @md:max-w-[80%] max-w-[90%] */}
              {heading && (
                <AnimatedSection
                  direction="right"
                  isPageEditing={isPageEditing}
                  reducedMotion={prefersReducedMotion}
                >
                  <Text
                    tag="h2"
                    className="font-heading @xs:text-3xl @sm:text-4xl @lg:text-5xl text-pretty text-2xl"
                    field={heading}
                  />
                </AnimatedSection>
              )}
              {description && (
                <AnimatedSection
                  direction="right"
                  isPageEditing={isPageEditing}
                  reducedMotion={prefersReducedMotion}
                  delay={600}
                >
                  <RichText
                    className="text-body @xs:text-lg @md:text-xl mt-6 max-w-[51.5ch] text-base font-normal tracking-tight antialiased"
                    field={description}
                  />
                </AnimatedSection>
              )}
              {hasLink && (
                <AnimatedSection
                  direction="right"
                  isPageEditing={isPageEditing}
                  reducedMotion={prefersReducedMotion}
                  delay={1200}
                >
                  <div className="mt-8">
                    <Button buttonLink={link} isPageEditing={isPageEditing}></Button>
                  </div>
                </AnimatedSection>
              )}
            </div>
          </div>
          {image && (
            <AnimatedSection
              direction="left"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
              className="@md:w-1/2 @md:h-auto h-[300px] w-full"
              delay={200}
            >
              <ImageWrapper
                image={image}
                className="h-full w-full object-cover"
                wrapperClass="w-full h-full"
                priority={true}
              />
            </AnimatedSection>
          )}
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Promo Image: Left" />;
};
