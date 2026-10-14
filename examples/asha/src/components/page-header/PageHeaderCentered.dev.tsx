'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import type { PageHeaderProps } from './page-header.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';

export const PageHeaderCentered: React.FC<PageHeaderProps & { isPageEditing: boolean }> = (
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
        className="bg-background text-foreground @container group w-full overflow-hidden"
      >
        <div className="">
          <div className="@lg:pt-24 @lg:pb-0 @xl:mx-auto @lg:max-w-screen-xl @xl:group-[.container--full-bleed]:px-8 border-primary-foreground relative mx-auto w-full border-l-2 border-r-2 py-16 group-[.container--full-bleed]:px-4 [&:not(.px-6_&):not(.px-8_&):not(.px-10_&)]:px-6">
            <div className="flex flex-col items-center">
              {/* Header Content */}
              <div className=" mx-auto mb-12 px-4 text-center">
                <AnimatedSection
                  reducedMotion={prefersReducedMotion}
                  isPageEditing={isPageEditing}
                  className="w-full"
                >
                  <Text
                    tag="h1"
                    className="font-heading elative mx-auto text-balance text-center text-6xl font-light tracking-tighter antialiased"
                    field={title}
                  />
                </AnimatedSection>
                {/* Subtitle */}
                {subtitle && (
                  <AnimatedSection
                    reducedMotion={prefersReducedMotion}
                    isPageEditing={isPageEditing}
                  >
                    <RichText
                      className="font-body mx-auto mt-6 max-w-[50ch] text-pretty px-6 text-center leading-relaxed"
                      field={subtitle}
                    />
                  </AnimatedSection>
                )}
                {shouldShowButtons && (
                  <AnimatedSection
                    reducedMotion={prefersReducedMotion}
                    isPageEditing={isPageEditing}
                  >
                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                      {link1?.jsonValue && (
                        <EditableButton
                          buttonLink={link1?.jsonValue}
                          variant="default"
                          isPageEditing={isPageEditing}
                          className="border-none bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700"
                        />
                      )}
                      {link2?.jsonValue && (
                        <EditableButton
                          buttonLink={link2?.jsonValue}
                          variant="secondary"
                          isPageEditing={isPageEditing}
                          className="border-gray-700 bg-gray-800 px-6 py-2.5 text-white hover:bg-gray-700"
                        />
                      )}
                    </div>
                  </AnimatedSection>
                )}
              </div>
              {/* Image */}
              <div className="mx-auto w-full max-w-5xl">
                <AnimatedSection
                  reducedMotion={prefersReducedMotion}
                  isPageEditing={isPageEditing}
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
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="PageHeader" />;
};
