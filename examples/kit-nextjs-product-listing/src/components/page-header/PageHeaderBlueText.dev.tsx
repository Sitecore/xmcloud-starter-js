import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { PageHeaderProps } from './page-header.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';

export const PageHeaderBlueText: React.FC<PageHeaderProps & { isPageEditing: boolean }> = (
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
        data-component="PageHeader"
        data-class-change
        className={cn(
          'bg-background text-primary-foreground group relative w-full overflow-hidden',
          {
            'position-left': !hasPagesPositionStyles,
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
      >
        <div className="@container/headerwrapper">
          <div className="@lg/headerwrapper:pt-20 @lg/headerwrapper:pb-16 @xl/headerwrapper:mx-auto @lg/headerwrapper:max-w-screen-xl @xl/headerwrapper:group-[.container--full-bleed]:px-8 @sm/headerwrapper:px-5 @md/headerwrapper:px-10 @lg/headerwrapper:px-24 @xl/headerwrapper:py-32 @lg/headerwrapper:py-22 @sm/headerwrapper:py-12 @sm/headerwrapper:min-h-[575px] @sm/headerwrapper:group-[.container--full-bleed]:px-4 relative mx-auto w-full">
            {/* Blue Box */}
            <div className="@container/headercontent bg-primary text-primary-foreground relative z-10 max-w-[700px] p-10">
              {/* Left Line */}
              <div className="absolute bottom-0 left-0 top-0">
                <div className="bg-foreground @md/headerwrapper:block absolute -bottom-[100vw] -top-[100vw] left-0 hidden w-[2px]"></div>
              </div>
              {/* Right Line */}
              <div className="absolute bottom-0 right-0 top-0">
                <div className="bg-foreground @md/headerwrapper:block absolute -bottom-[100vw] -top-[100vw] right-0 hidden w-[2px]"></div>
              </div>

              <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
                {/* Title */}
                <Text
                  tag="h1"
                  className="font-heading @[575px]/headercontent:text-6xl @xs/headercontent:text-5xl relative -ml-[0.1em] max-w-[14ch] text-balance text-left text-4xl font-light tracking-tighter antialiased"
                  field={title}
                />
              </AnimatedSection>
              {/* Subtitle */}
              {subtitle && (
                <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
                  <RichText
                    className="font-body mt-4 max-w-[50ch] text-pretty leading-tight"
                    field={subtitle}
                  />
                </AnimatedSection>
              )}
              {shouldShowButtons && (
                <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
                  <div className="mt-9 flex flex-wrap gap-4">
                    {link1?.jsonValue && (
                      <EditableButton
                        buttonLink={link1?.jsonValue}
                        variant="outline"
                        isPageEditing={isPageEditing}
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
          </div>
          {/* Image */}
          <ImageWrapper
            image={imageRequired?.jsonValue}
            wrapperClass="@sm/headerwrapper:absolute w-full @sm/headerwrapper:inset-0"
            className="h-full w-full object-cover"
            priority={true}
          />
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="PageHeader" />;
};
