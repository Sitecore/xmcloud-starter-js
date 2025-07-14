import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Text, RichText } from '@sitecore-content-sdk/nextjs';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { PageHeaderProps } from './page-header.props';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';

export const PageHeaderDefault: React.FC<PageHeaderProps & { isPageEditing: boolean }> = (
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
        className={cn('bg-background text-foreground group w-full overflow-hidden', {
          'position-left': !hasPagesPositionStyles,
          [props?.params?.styles]: props?.params?.styles,
        })}
      >
        <div className="@container/headerwrapper">
          <div className="@lg/headerwrapper:pt-20 @lg/headerwrapper:pb-16 @xl/headerwrapper:mx-auto @lg/headerwrapper:max-w-screen-xl @xl/headerwrapper:group-[.container--full-bleed]:px-8 relative mx-auto w-full py-12 group-[.container--full-bleed]:px-4">
            <div className="@md/headerwrapper:grid-cols-2 @md/headerwrapper:grid-rows-[17fr_4fr_29fr] grid grid-cols-1 gap-x-[10px] gap-y-0">
              {/* Left */}
              <div className="@container/headercontent @md/headerwrapper:row-start-1 @md/headerwrapper:row-end-4 @md/headerwrapper:col-start-1 @md/headerwrapper:col-end-2 @md/headerwrapper:mb-0 mb-10">
                <AnimatedSection
                  reducedMotion={prefersReducedMotion}
                  isPageEditing={isPageEditing}
                  className="w-full"
                >
                  <Text
                    tag="h1"
                    className="font-heading @[575px]/headercontent:text-6xl @xs/headercontent:text-5xl relative -ml-[0.1em] max-w-[14ch] text-balance text-left text-4xl font-light tracking-tighter antialiased"
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
                      className="font-body mt-4 max-w-[50ch] text-pretty leading-tight"
                      field={subtitle}
                    />
                  </AnimatedSection>
                )}
                {shouldShowButtons && (
                  <AnimatedSection
                    reducedMotion={prefersReducedMotion}
                    isPageEditing={isPageEditing}
                  >
                    <div className="mt-9 flex flex-wrap gap-4">
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
              {/* Right */}
              <div className="@md/headerwrapper:row-start-2 @md/headerwrapper:row-end-4 @md/headerwrapper:col-start-2 @md/headerwrapper:col-end-3 @md/headerwrapper:self-end @md/headerwrapper:justify-self-end @md/headerwrapper:mt-auto relative w-full">
                {/* Centered Line */}
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
                    wrapperClass="aspect-[30/19] w-full before:block before:w-full before:aspect-[30/19]"
                    className="absolute inset-0 aspect-[30/19] h-full w-full object-cover"
                  />
                </AnimatedSection>
                {/* Right Line */}
                <div className="absolute bottom-0 right-0 top-0">
                  <div className="@md/headerwrapper:bg-foreground absolute -bottom-[100vw] -top-[100vw] right-0 block w-[2px] bg-gradient-to-t from-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="PageHeader" />;
};
