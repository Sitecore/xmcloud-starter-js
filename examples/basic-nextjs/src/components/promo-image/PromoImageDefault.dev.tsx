import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { PromoImageProps } from './promo-image.props';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { useMatchMedia } from '@/hooks/use-match-media';

export const PromoImageDefault: React.FC<PromoImageProps> = (props) => {
  const { fields, isPageEditing } = props;
  const prefersReducedMotion = useMatchMedia('(prefers-reduced-motion: reduce)');

  if (fields) {
    const { image, heading, description, link } = fields;
    const hasLink = isPageEditing || link?.value?.href;

    return (
      <section
        data-component="Promo Image"
        className="@container border-b-2 border-t-2 [.border-b-2+&]:border-t-0"
      >
        <div className="@md:min-h-[760px] relative max-h-[759px] min-h-[450px] w-full overflow-hidden ">
          {image && (
            <div className="absolute inset-0 h-full w-full">
              <ImageWrapper
                image={image}
                className="h-full w-full object-cover"
                wrapperClass="w-full h-full"
                priority={true}
              />
              {/* Vignette effect overlay */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)',
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.2) 100%)',
                }}
              ></div>
            </div>
          )}

          <div className="@xs:pl-8 @sm:pl-12 @md:pl-16 @lg:pl-[118px] @xs:pr-6 @sm:pr-12 @md:py-16 relative z-10 mx-auto flex h-full w-full max-w-screen-xl flex-col justify-center px-4 py-24">
            <div className="@xs:max-w-[90%] @sm:max-w-[80%] @md:max-w-[60%] @lg:max-w-[50%]">
              {heading && (
                <AnimatedSection
                  direction="right"
                  isPageEditing={isPageEditing}
                  reducedMotion={prefersReducedMotion}
                >
                  <Text
                    tag="h2"
                    className="font-heading @xs:text-3xl @sm:text-4xl @lg:text-5xl text-primary-foreground text-pretty text-2xl"
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
                    className="text-body text-primary-foreground @xs:text-lg @md:text-xl mt-6 max-w-[51.5ch] font-normal tracking-tight antialiased"
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
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Promo Image" />;
};
