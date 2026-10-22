'use client';

import { useState, useEffect } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { TextBannerProps } from './text-banner.props';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { CompatibleLink } from '@/components/content-sdk/CompatibleLink';
import { NoDataFallback } from '@/utils/NoDataFallback';

/* Default appearance:
 * Section intro on white: medium-weight heading, light lead paragraph
 * and an optional text link with a caret.
 */
export const TextBannerDefault: React.FC<TextBannerProps> = (props) => {
  const { fields, isPageEditing } = props;
  const { heading, description, link } = fields ?? {};

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  if (!fields) {
    return <NoDataFallback componentName="Text Banner" />;
  }

  const hasLink = isPageEditing || Boolean(link?.value?.href);

  return (
    <section data-component="TextBanner" className="w-full bg-white text-black">
      <div className="mx-auto max-w-[1311px] px-6 pb-6 pt-[89px]">
        <AnimatedSection direction="up" isPageEditing={isPageEditing} reducedMotion={prefersReducedMotion}>
          <Text
            tag="h2"
            field={heading}
            className="mb-4 text-balance text-3xl font-medium leading-tight md:text-[2.25rem]"
          />
          {(description?.value || isPageEditing) && (
            <Text tag="p" field={description} className="mb-6 max-w-3xl text-pretty text-base font-light leading-relaxed" />
          )}
          {hasLink && link && (
            <CompatibleLink
              field={link}
              editable={isPageEditing}
              prefetch={false}
              className="text-primary inline-flex items-center gap-2 text-sm font-medium after:text-[0.7em] after:content-['▸'] hover:underline"
            />
          )}
        </AnimatedSection>
      </div>
    </section>
  );
};
