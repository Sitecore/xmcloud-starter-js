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
import { USER_ZIPCODE } from 'lib/constants';

export const HeroImageBackground: React.FC<HeroProps> = (props) => {
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
          className={cn('group relative', {
            'position-left': !hasPagesPositionStyles,
            [props?.params?.styles]: props?.params?.styles,
          })}
        >
          {/* Image */}
          <ImageWrapper
            image={image}
            wrapperClass="absolute w-full inset-0 scrim-background/50 scrim-l-full group-[.position-right]:scrim-r-full group-[.position-right]:scrim-l-0 group-[.position-center]:scrim-l-0 group-[.position-center]:scrim-b-full"
            className="h-full w-full object-cover opacity-80"
            priority={true}
          />

          {/* Blur effect for mobile */}
          <div className="fade-to-transparent fade-to-transparent-bottom @md/herowrapper:hidden absolute inset-0 w-full backdrop-blur-sm"></div>

          {/* Content */}
          <div className="@container/herocontent @sm/herowrapper:px-5 @sm/herowrapper:pb-5 @md/herowrapper:px-10 @md/herowrapper:pb-10 @md/herowrapper:pt-20 @lg/herowrapper:px-24 @lg/herowrapper:pb-20 @lg/herowrapper:pt-36 relative z-10 mx-auto flex max-w-[1240px] flex-col pt-10 group-[.position-right]:items-end group-[.position-center]:items-center">
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
                className="font-heading text-box-trim-both-baseline @lg/herowrapper:p-0 text-shadow text-shadow-blur-xl @sm/herowrapper:text-shadow-blur-3xl @sm/herowrapper:px-0 relative -ml-[2px] max-w-[13ch] text-balance px-5 text-[clamp(3rem,9cqi,6rem)] font-light leading-tight drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)]"
              />
            </AnimatedSection>

            {/* Line */}
            <div className="@xl/herowrapper:py-10 py-8">
              <div className="bg-foreground absolute left-1/2 h-[2px] w-[200vw] -translate-x-1/2"></div>
            </div>

            {/* Description */}
            <AnimatedSection
              direction="up"
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
              delay={200}
            >
              {description && (
                <Text
                  tag="p"
                  className="@xs/herocontent:text-xl @sm/herowrapper:px-0 text-shadow text-shadow-blur-xl max-w-[32ch] text-pretty px-5 leading-tight"
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
              className="@sm/herowrapper:px-0 @md/herowrapper:mt-7 mt-4 w-full px-5"
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

            {/* Banner overlay */}
            {needsBanner && (
              <div className="@container/herobanner bg-overlay text-primary-foreground @md/herowrapper:mt-10 @xl/herowrapper:mt-16 z-10 mt-8 w-full max-w-[50rem]">
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
