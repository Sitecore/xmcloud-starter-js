import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { Default as ZipcodeSearchForm } from '@/components/forms/zipcode/ZipcodeSearchForm.dev';
import { HeroProps } from './hero.props';
import { USER_ZIPCODE } from '@/lib/constants';

export const HeroDefault: React.FC<HeroProps> = (props) => {
  const { fields, isPageEditing } = props;
  const { title, description, bannerText, bannerCTA, image, dictionary, searchLink } = fields;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  if (fields) {
    const needsBanner: boolean = isPageEditing
      ? true
      : bannerText?.value !== '' || bannerCTA?.value.href !== ''
      ? true
      : false;

    const hasPagesPositionStyles: boolean = props?.params?.styles
      ? props?.params?.styles.includes('position-')
      : false;

    return (
      <section
        data-component="Hero"
        className="@container/herowrapper bg-background text-foreground relative w-full overflow-hidden"
      >
        <div
          data-class-change
          className={cn(
            '@lg/herowrapper:grid @lg/herowrapper:gap-0 @lg/herowrapper:my-36 @lg/herowrapper:max-w-[1216px] @lg/herowrapper:mx-10 @xl/herowrapper:mx-auto @lg/herowrapper:grid-cols-[33%_11%_23%_33%] @lg/herowrapper:grid-rows-[52px_auto_2px_auto_auto] group',
            {
              'position-left': !hasPagesPositionStyles,
              [props?.params?.styles]: props?.params?.styles,
            }
          )}
        >
          {/* Title */}
          <AnimatedSection
            direction="up"
            className="@lg/herowrapper:row-start-1 @lg/herowrapper:row-end-3 @lg/herowrapper:col-start-1 @lg/herowrapper:col-end-4 relative z-20"
            isPageEditing={isPageEditing}
            reducedMotion={prefersReducedMotion}
          >
            <Text
              tag="h1"
              field={title}
              className="font-heading @md/herowrapper:text-[clamp(4.5rem,9cqi,8rem)] text-box-trim-top @lg/herowrapper:p-0 text-shadow @lg/herowrapper:text-shadow-blur-3xl @lg/herowrapper:drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)] relative -ml-[2px] text-balance px-4 pt-8 text-5xl font-light leading-tight"
            />
          </AnimatedSection>

          {/* Line */}
          <div className="@lg/herowrapper:block @lg/herowrapper:row-start-3 @lg/herowrapper:row-end-4 @lg/herowrapper:col-start-1 @lg/herowrapper:col-end-5 hidden">
            <div className="bg-foreground absolute left-0 right-0 h-[2px] w-[100vw]"></div>
          </div>

          {/* Description & Form */}
          <div className="form @lg/herowrapper:p-0 @lg/herowrapper:col-start-1 @lg/herowrapper:col-end-2 @lg/herowrapper:row-start-4 @lg/herowrapper:row-end-5 @lg/herowrapper:self-end @lg/herowrapper:mt-6 mt-6 px-4 pb-8 [&>*+*]:mt-6">
            <AnimatedSection
              direction="up"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
              delay={200}
            >
              {description && (
                <Text
                  tag="div"
                  className="@sm/herowrapper:text-xl @lg/herowrapper:p-0 mt-0 text-pretty leading-tight"
                  field={description}
                />
              )}
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection
              direction="up"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
              delay={400}
            >
              <ZipcodeSearchForm
                placeholder={dictionary.ZipPlaceholder}
                buttonText={dictionary?.SubmitCTALabel}
                onSubmit={(values) => {
                  sessionStorage.setItem(USER_ZIPCODE, values.zipcode);
                  if (searchLink) {
                    window.location.href = `${searchLink.value.href}`;
                  }
                }}
              />
            </AnimatedSection>
          </div>

          {/* Hero image */}
          <ImageWrapper
            image={image}
            wrapperClass="@lg/herowrapper:col-start-3 @lg/herowrapper:col-end-5 @lg/herowrapper:row-start-2 @lg/herowrapper:row-end-5 before:hidden @lg/herowrapper:before:block @lg/herowrapper:before:w-full @lg/herowrapper:before:aspect-[674/600] @lg/herowrapper:relative w-full"
            className="@lg/herowrapper:h-full @lg/herowrapper:aspect-auto @lg/herowrapper:absolute @lg/herowrapper:inset-0 relative z-10 aspect-video w-full object-cover"
            priority={true}
          />

          {/* Banner */}
          {needsBanner && (
            <div className="bg-primary text-primary-foreground @lg/herowrapper:col-start-3 @lg/herowrapper:col-end-5 @lg/herowrapper:row-start-5 @lg/herowrapper:row-end-6 @md/herowrapper:flex @md/herowrapper:gap-10 @md/herowrapper:items-center @md/herowrapper:justify-between @md/herowrapper:p-5 p-4">
              {bannerText && (
                <AnimatedSection
                  direction="up"
                  isPageEditing={isPageEditing}
                  reducedMotion={prefersReducedMotion}
                >
                  <Text
                    tag="p"
                    className="@md/herowrapper:text-lg font-heading text-pretty font-light leading-tight"
                    field={bannerText}
                  />
                </AnimatedSection>
              )}
              {bannerCTA && (
                <AnimatedSection
                  direction="up"
                  className="@md/herowrapper:mt-0 mt-4 first:mt-0"
                  isPageEditing={isPageEditing}
                  reducedMotion={prefersReducedMotion}
                  delay={200}
                >
                  <ButtonBase
                    buttonLink={bannerCTA}
                    variant="secondary"
                    isPageEditing={isPageEditing}
                  />
                </AnimatedSection>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Hero" />;
};
