'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import type { PageHeaderProps } from './page-header.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';

export const PageHeaderBlueBackground: React.FC<PageHeaderProps & { isPageEditing: boolean }> = (
  props
) => {
  const { fields, isPageEditing } = props;
  const { imageRequired, link1, link2 } = fields?.data?.datasource || {};
  const { pageHeaderTitle, pageTitle, pageSubtitle } = fields?.data?.externalFields || {};

  const title = pageHeaderTitle?.jsonValue?.value
    ? pageHeaderTitle?.jsonValue
    : pageTitle?.jsonValue;
  const subtitle = pageSubtitle?.jsonValue;

  const shouldShowButtons: boolean = isPageEditing
    ? true
    : link1?.jsonValue?.value?.href !== '' || link2?.jsonValue?.value?.href !== ''
      ? true
      : false;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  if (fields) {
    return (
      <section
        data-component="PageHeader"
        data-class-change
        className="bg-primary text-primary-foreground border-primary-foreground @container group w-full overflow-hidden border-b-2 border-t-2"
      >
        <div className="@lg:pt-5 @lg:pb-0 @md:grid-cols-2 relative mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-0 px-0 [&:not(.px-6_&):not(.px-8_&):not(.px-10_&)]:px-6">
          {/* Right Content */}
          <div className="@container @md:col-start-2 @md:col-end-3 @md:mb-0 @md:flex @md:flex-col @md:justify-center @md:py-16 py-8 pt-8">
            <AnimatedSection
              reducedMotion={prefersReducedMotion}
              isPageEditing={isPageEditing}
              className="w-full"
              direction="left"
            >
              <Text
                tag="h1"
                className="font-heading @xs:text-6xl leading-tighter relative max-w-[14ch] text-balance text-left  text-6xl font-light tracking-tighter antialiased"
                field={title}
              />
            </AnimatedSection>
            {/* Subtitle */}
            {subtitle && (
              <AnimatedSection
                reducedMotion={prefersReducedMotion}
                isPageEditing={isPageEditing}
                direction="left"
                delay={600}
              >
                <RichText
                  className="font-body mt-6 max-w-[50ch] text-pretty leading-relaxed"
                  field={subtitle}
                />
              </AnimatedSection>
            )}
            {shouldShowButtons && (
              <AnimatedSection
                reducedMotion={prefersReducedMotion}
                isPageEditing={isPageEditing}
                direction="left"
                delay={800}
              >
                <div className="mt-10 flex flex-wrap gap-4">
                  {link1?.jsonValue && (
                    <EditableButton
                      buttonLink={link1?.jsonValue}
                      variant="default"
                      isPageEditing={isPageEditing}
                      className="border-1 border-primary-foreground hover:bg-primary-foreground/10"
                    />
                  )}
                  {link2?.jsonValue && (
                    <EditableButton
                      buttonLink={link2?.jsonValue}
                      variant="secondary"
                      isPageEditing={isPageEditing}
                    />
                  )}
                </div>
              </AnimatedSection>
            )}
          </div>
          {/* Right Content */}
        </div>
        <div className=" border-primary-foreground  mb-16 border-2 border-l-0 border-r-0">
          {/* Left Image */}
          <div className="@xl:mx-auto @lg:max-w-screen-xl @xl:group-[.container--full-bleed]:px-8 @md:grid-cols-2 relative mx-auto grid w-full grid-cols-1 gap-0 group-[.container--full-bleed]:px-4 ">
            <div className="@md:col-start-1 @md:col-end-2 @md:row-start-1 relative w-full">
              <AnimatedSection
                reducedMotion={prefersReducedMotion}
                isPageEditing={isPageEditing}
                direction="right"
                delay={1200}
                className="relative"
              >
                <ImageWrapper
                  image={imageRequired?.jsonValue}
                  wrapperClass="aspect-[16/9] w-full before:block before:w-full before:aspect-[16/9]"
                  className="absolute inset-0 aspect-[16/9] h-full w-full object-cover"
                />
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="PageHeader" />;
};
