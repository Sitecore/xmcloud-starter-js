import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { PageHeaderProps } from './page-header.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';

export const PageHeaderFiftyFifty: React.FC<PageHeaderProps & { isPageEditing: boolean }> = (
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
        className={cn('bg-background text-primary-foreground group w-full overflow-hidden', {
          'position-left': !hasPagesPositionStyles,
          [props?.params?.styles]: props?.params?.styles,
        })}
      >
        <div className="@container/headerwrapper">
          {/* 50-50 variant - Equal width columns */}
          <div className="@lg/headerwrapper:py-20 @xl/headerwrapper:mx-auto @lg/headerwrapper:max-w-screen-xl @xl/headerwrapper:group-[.container--full-bleed]:px-8 @md:grid-cols-2 @md:gap-0 @md:grid-rows-[1fr_auto_1fr] relative mx-auto grid w-full grid-cols-1 gap-8 py-12 group-[.container--full-bleed]:px-4">
            {/* Left - 50% width */}
            <div className="@container/headercontent @md:row-start-2 @md:row-end-3 @md:col-start-1 @md:col-end-2 pr-11">
              <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
                <Text
                  tag="h1"
                  className="font-heading @[550px]/headercontent:text-6xl @xs/headercontent:text-5xl @md/headerwrapper:pl-0 relative -ml-[0.1em] max-w-[14ch] text-balance pl-8 text-left text-4xl font-light tracking-tighter antialiased"
                  field={title}
                />
              </AnimatedSection>
              {/* Subtitle */}
              {subtitle && (
                <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
                  <RichText
                    className="font-body @md/headerwrapper:pl-0 mt-4 max-w-[50ch] text-pretty pl-8 leading-tight"
                    field={subtitle}
                  />
                </AnimatedSection>
              )}
              {shouldShowButtons && (
                <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
                  <div className="@md/headerwrapper:pl-0 mt-9 flex flex-wrap gap-4 pl-8">
                    {link1?.jsonValue && (
                      <EditableButton
                        buttonLink={link1?.jsonValue}
                        variant="default"
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
            {/* Right - 50% width */}
            <div className="@md:row-start-2 @md:row-end-3 @md:col-start-2 @md:col-end-3 relative h-full w-full">
              {/* Line Centered on Image */}
              <div className="@md/headerwrapper:block absolute bottom-0 left-1/2 top-0 mx-auto hidden w-full -translate-x-[50%]">
                <div className="bg-foreground absolute -bottom-[100vw] -top-[100vw] right-[50%] block w-[2px] -translate-x-[50%]"></div>
              </div>
              {/* Image */}
              <AnimatedSection
                reducedMotion={prefersReducedMotion}
                isPageEditing={isPageEditing}
                className="relative"
              >
                <ImageWrapper
                  image={imageRequired?.jsonValue}
                  className="h-full w-full object-cover"
                />
              </AnimatedSection>
              {/* Page centered Line */}
              <div className="absolute bottom-0 left-0 top-0">
                <div className="@md/headerwrapper:bg-foreground absolute -bottom-[100vw] -top-[100vw] left-0 block w-[2px] bg-gradient-to-t from-white"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="PageHeader" />;
};
