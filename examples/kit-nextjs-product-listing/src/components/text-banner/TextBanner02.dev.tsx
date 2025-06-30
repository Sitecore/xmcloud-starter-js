import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
// import { cva } from 'class-variance-authority';
import { Text } from '@sitecore-content-sdk/nextjs';
import { TextBannerProps } from './text-banner.props';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';

/* Text Banner 02 appearance:
 * Black background, content stacked vertically
 * Title centered
 * Description centered
 */

export const TextBanner02: React.FC<TextBannerProps> = (props) => {
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

  // Themes may be added back in later
  // const { theme } = params ?? {};
  // const componentTheme = cva('p-5 mt-4', {
  //   variants: {
  //     theme: {
  //       primary: 'bg-primary text-primary-foreground',
  //       secondary: 'bg-secondary text-secondary-foreground',
  //     },
  //   },
  //   defaultVariants: {
  //     theme: 'primary',
  //   },
  // });

  if (fields) {
    return (
      <section
        data-component="TextBanner"
        data-class-change
        className={cn(
          'bg-background text-foreground group relative w-full border-b-2 border-t-2 [.border-b-2+&]:border-t-0',
          {
            'position-center': !hasPagesPositionStyles,
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
      >
        <div className="@container/textbanner">
          <div className="@lg/textbanner:px-5 mx-auto max-w-screen-xl px-10 py-20">
            {/* Title */}
            <AnimatedSection
              direction="down"
              duration={700}
              threshold={0.4}
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
            >
              <Text
                tag="h2"
                field={heading}
                className="font-heading text-box-trim-both-baseline mx-auto max-w-[11.35ch] text-balance text-center"
              />
            </AnimatedSection>
            {/* Description */}
            <AnimatedSection
              direction="up"
              delay={300}
              isPageEditing={isPageEditing}
              reducedMotion={prefersReducedMotion}
            >
              <Text
                tag="p"
                field={description}
                className="text-box-trim-both-baseline mx-auto mt-10 max-w-[53.3855ch] text-pretty text-center leading-tight"
              />
            </AnimatedSection>
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="Text Banner: 02" />;
};
