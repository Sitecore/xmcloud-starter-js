import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
// import { cva } from 'class-variance-authority';
import { Text } from '@sitecore-content-sdk/nextjs';
import { TextBannerProps } from './text-banner.props';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';

/* Default appearance:
 * Black background, 50/50 columns, text v-aligned to baseline
 * Title left
 * Description right
 */

export const TextBannerTextTop: React.FC<TextBannerProps> = (props) => {
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
          'bg-background text-foreground border-foreground group relative w-full border-b-2 border-t-2 [.border-b-2+&]:border-t-0',
          {
            'position-left': !hasPagesPositionStyles,
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
      >
        <div className="@container/textbanner">
          <div className="@lg/textbanner:mx-auto @lg/textbanner:grid @lg/textbanner:gap-4 @lg/textbanner:grid-cols-2 @lg/textbanner:grid-rows-1 @xl/textbanner:group-[.container--full-bleed]:px-8   max-w-screen-xl py-28 group-[.container--full-bleed]:px-4">
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
                className="font-heading text-box-trim-both-baseline relative -ml-[0.1em] max-w-[11.35ch] text-balance text-left"
              />
            </AnimatedSection>
            {/* Description */}
            <AnimatedSection
              direction="down"
              delay={600}
              distanceInRem={4}
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
            >
              <Text
                tag="p"
                field={description}
                className="text-box-trim-both-baseline @lg/textbanner:mt-0 mt-10 max-w-[53.3855ch] text-pretty text-left leading-tight"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="Text Banner" />;
};
