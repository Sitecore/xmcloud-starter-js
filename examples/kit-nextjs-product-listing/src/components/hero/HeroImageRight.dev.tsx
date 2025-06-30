'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { Default as ZipcodeSearchForm } from '@/components/forms/zipcode/ZipcodeSearchForm.dev';
import type { HeroProps } from './hero.props';
import { USER_ZIPCODE } from '@/lib/constants';

export const HeroImageRight: React.FC<HeroProps> = (props) => {
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
          className={cn(
            '@lg/herowrapper:max-w-[1440px] @lg/herowrapper:mx-auto @md/herowrapper:flex-row group flex min-h-[600px] flex-col',
            {
              'position-left': !hasPagesPositionStyles,
              [props?.params?.styles]: props?.params?.styles,
            }
          )}
        >
          {/* Left content */}
          <div className="@container/herocontent @md/herowrapper:w-1/2 @sm/herowrapper:p-11 @[1200px]/herowrapper:p-24 flex flex-col items-center justify-center p-5 group-[.position-left]:items-start group-[.position-right]:items-end">
            {/* Title */}
            <AnimatedSection
              direction="up"
              className="relative z-20"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
            >
              <Text
                tag="h1"
                field={title}
                className="font-heading @md/herowrapper:text-[clamp(3rem,18cqi,6rem)] relative -ml-[2px] max-w-[15ch] text-balance text-[clamp(3rem,11cqi,4rem)] font-light leading-tight"
              />
            </AnimatedSection>

            {/* Description */}
            <AnimatedSection
              direction="up"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
              delay={200}
              className="mt-6"
            >
              {description && (
                <Text
                  tag="p"
                  className="@xs/herocontent:text-xl max-w-[32ch] text-pretty leading-tight"
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
              className="mt-6 w-full"
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

          {/* Image */}
          <div className="@md/herowrapper:w-1/2 before:bg-foreground @md/herowrapper:before:w-[2px] @md/herowrapper:before:h-full @md/herowrapper:before:-left-[2px] @md/herowrapper:before:top-0 @md/herowrapper:before:bottom-0 relative before:absolute before:-top-[2px] before:left-0 before:right-0 before:z-10 before:block before:h-[2px] before:w-full">
            <ImageWrapper
              image={image}
              wrapperClass="max-h-[900px] relative w-full aspect-square @md/herowrapper:aspect-auto @md/herowrapper:absolute @md/herowrapper:top-0 @md/herowrapper:right-0 @md/herowrapper:bottom-0 @md/herowrapper:left-0 "
              className="absolute bottom-0 left-0 right-0 top-0 h-full w-full object-cover"
              priority={true}
            />

            {/* Banner overlay */}
            {needsBanner && (
              <div className="@container/herobanner bg-card-foreground @xs/herowrapper:bg-overlay text-primary-foreground @xs/herowrapper:absolute @xs/herowrapper:w-[calc(100%-40px)] @xs/herowrapper:bottom-5 @xs/herowrapper:left-5 @xs/herowrapper:group-[.position-right]:left-auto @xs/herowrapper:group-[.position-center]:left-1/2 @xs/herowrapper:group-[.position-center]:-translate-x-[50%] @xs/herowrapper:group-[.position-right]:right-5 @sm/herowrapper:w-[calc(100%-88px)] @sm/herowrapper:bottom-11 @sm/herowrapper:left-11 @sm/herowrapper:group-[.position-right]:right-11 relative z-10 w-full max-w-[27rem]">
                <div className="@[35rem]/herobanner:flex-row @[35rem]/herobanner:items-center @[35rem]/herobanner:justify-between @[35rem]/herobanner:flex @[35rem]/herobanner:gap-10 @[35rem]/herobanner:text-left p-5">
                  {bannerText && (
                    <AnimatedSection
                      direction="up"
                      isPageEditing={isPageEditing}
                      reducedMotion={prefersReducedMotion}
                    >
                      <Text
                        tag="p"
                        className="font-heading @md/herowrapper:text-lg text-pretty font-light leading-tight"
                        field={bannerText}
                      />
                    </AnimatedSection>
                  )}
                  {bannerCTA && (
                    <AnimatedSection
                      direction="up"
                      className="@[35rem]/herobanner:mt-0 mt-6"
                      isPageEditing={isPageEditing}
                      reducedMotion={prefersReducedMotion}
                      delay={200}
                    >
                      <ButtonBase
                        buttonLink={bannerCTA}
                        variant="default"
                        isPageEditing={isPageEditing}
                      />
                    </AnimatedSection>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Hero" />;
};
