'use client';

import { useState, useEffect } from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { HeroProps } from './hero.props';

/**
 * Full-height brand hero: dark gradient (or background image), small accent eyebrow,
 * a light-weight headline and a single call to action, all centred.
 */
export const HeroDefault: React.FC<HeroProps> = (props) => {
  const { fields, isPageEditing } = props;
  const { title, description, badge, bannerCTA, image } = fields || {};
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  if (!fields) {
    return <NoDataFallback componentName="Hero" />;
  }

  const hasImage = Boolean(image?.value?.src);
  const hasCta = isPageEditing || Boolean(bannerCTA?.value?.href);

  return (
    <section
      data-component="Hero"
      className="bg-brand-hero relative isolate flex min-h-[calc(100svh-96px)] w-full items-center justify-center overflow-hidden px-4 py-24 text-center text-white"
    >
      {(hasImage || isPageEditing) && (
        <ImageWrapper
          image={image}
          wrapperClass="absolute inset-0 -z-20"
          className="h-full w-full object-cover"
          priority={true}
          loading="eager"
          fetchPriority="high"
        />
      )}
      {hasImage && <div className="bg-brand-navy/70 absolute inset-0 -z-10" aria-hidden="true" />}
      <div
        className="pointer-events-none absolute -right-64 -top-72 -z-10 aspect-square w-[60rem] rounded-full border border-white/15"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-32 -top-44 -z-10 aspect-square w-[46rem] rounded-full border border-white/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1140px]">
        {(badge?.value || isPageEditing) && (
          <AnimatedSection direction="up" isPageEditing={isPageEditing} reducedMotion={prefersReducedMotion}>
            <Text tag="p" field={badge} className="text-accent mb-4 text-lg" />
          </AnimatedSection>
        )}
        <AnimatedSection
          direction="up"
          isPageEditing={isPageEditing}
          reducedMotion={prefersReducedMotion}
          delay={100}
        >
          <Text
            tag="h1"
            field={title}
            className="mb-8 text-balance text-4xl font-light leading-[1.05] text-white md:text-5xl lg:text-[3.5625rem]"
          />
        </AnimatedSection>
        {(description?.value || isPageEditing) && (
          <AnimatedSection
            direction="up"
            isPageEditing={isPageEditing}
            reducedMotion={prefersReducedMotion}
            delay={200}
          >
            <Text
              tag="p"
              field={description}
              className="mx-auto mb-8 max-w-3xl text-pretty text-lg font-light text-white/85"
            />
          </AnimatedSection>
        )}
        {hasCta && bannerCTA && (
          <AnimatedSection
            direction="up"
            isPageEditing={isPageEditing}
            reducedMotion={prefersReducedMotion}
            delay={300}
          >
            <ButtonBase buttonLink={bannerCTA} variant="secondary" isPageEditing={isPageEditing} />
          </AnimatedSection>
        )}
      </div>
    </section>
  );
};
