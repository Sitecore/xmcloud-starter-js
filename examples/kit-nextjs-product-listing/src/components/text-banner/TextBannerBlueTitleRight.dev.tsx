import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@sitecore-content-sdk/nextjs';
import { TextBannerProps } from './text-banner.props';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const TextBannerBlueTitleRight: React.FC<TextBannerProps> = (props) => {
  const { fields, isPageEditing } = props;
  const { heading, description } = fields ?? {};

  const hasPagesPositionStyles: boolean = props?.params?.styles
    ? props?.params?.styles.includes('position-')
    : false;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  if (fields) {
    return (
      <section
        data-component="TextBanner"
        data-class-change
        className={cn(
          'bg-primary text-foreground group relative w-full overflow-hidden border-b-2 border-t-2 [.border-b-2+&]:border-t-0',
          {
            'position-left': !hasPagesPositionStyles,
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
      >
        <div className="@container/textbanner">
          <div className="@lg/textbanner:mx-auto @xl/textbanner:group-[.container--full-bleed]:px-8 @lg/textbanner:pt-28 @lg/textbanner:pb-24 @sm/textbanner:py-14 @lg/textbanner:px-20 @sm/textbanner:px-14 mx-auto max-w-screen-xl px-6 py-8">
            {/* Title */}
            <AnimatedSection
              direction="left"
              distanceInRem={12}
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
            >
              <Text
                tag="h2"
                field={heading}
                className="text-box-trim-both-baseline font-heading @lg/textbanner:text-8xl relative text-balance text-right"
              />
            </AnimatedSection>
            {/* Description */}
            <AnimatedSection
              direction="right"
              delay={600}
              distanceInRem={4}
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
            >
              <Text
                tag="p"
                field={description}
                className="text-box-trim-both-baseline @lg/textbanner:mt-20 @md/textbanner:mt-16 @sm/textbanner:mt-12 mr-auto mt-10 max-w-[53.3855ch] text-pretty text-left leading-tight"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="Text Banner Variant 01" />;
};
