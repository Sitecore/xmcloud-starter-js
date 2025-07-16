import { useEffect, useState } from 'react';
import { Text, RichText, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';
import { PageHeaderProps } from './page-header.props';
import { VideoBase as Video } from '@/components/video/Video';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { cva } from 'class-variance-authority';

const pageHeaderComponentClasses = cva(
  '@container my-10 flex flex-col md:grid md:gap-8 md:items-center px-4 @xl:px-8',
  {
    variants: {
      colorScheme: {
        default: '',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
      },
    },
  }
);

export const Default: React.FC<PageHeaderProps> = ({ fields, params }) => {
  const { imageRequired, videoOptional, logoText, children } = fields?.data?.datasource || {};
  const { pageHeaderTitle, pageTitle, pageSubtitle } = fields?.data?.externalFields || {};

  const title = pageHeaderTitle?.jsonValue ?? pageTitle?.jsonValue;
  const subtitle = pageSubtitle?.jsonValue;

  const { colorScheme = 'default', darkPlayIcon = '0' } = params;
  const { page } = useSitecore();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const isPageEditing = page.mode.isEditing;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  if (fields) {
    const containerClasses = cn(pageHeaderComponentClasses({ colorScheme }));

    return (
      <section className={containerClasses}>
        <div className="@md:grid-cols-2 @lg:gap-12 mx-auto grid w-full grid-cols-1 gap-8">
          {/* Left */}
          <div className="flex flex-col justify-between">
            <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
              <Text
                tag="h1"
                className="@md:text-5xl @lg:text-7xl font-heading text-pretty text-5xl font-normal leading-[0.93] tracking-tighter"
                field={title}
              />
            </AnimatedSection>
            {children?.results && (
              <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
                <div className="@md:mt-16 mt-4 flex max-w-[504px] flex-col gap-6">
                  <Text
                    tag="p"
                    className="letter-spacing-[-0.4%] line-height-[24px] text-base font-medium"
                    field={logoText?.jsonValue}
                  />
                  <div className="flex flex-nowrap items-center justify-between gap-8">
                    {children.results.map((logo, index) => (
                      <div key={index}>
                        <ImageWrapper image={logo.image?.jsonValue} />
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>
          {/* Right */}
          <div className="flex flex-col justify-end gap-10">
            <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
              <RichText
                className="line-height[26px] @lg:ms-auto max-w-[547px] text-lg font-medium tracking-tight"
                field={subtitle}
              />
            </AnimatedSection>
            <AnimatedSection reducedMotion={prefersReducedMotion} isPageEditing={isPageEditing}>
              <div className="@md:rounded-[22px] @lg:ms-auto relative max-w-[547px] overflow-hidden rounded-xl">
                {videoOptional?.jsonValue?.value?.href ? (
                  <Video
                    fields={{ video: videoOptional?.jsonValue, image: imageRequired?.jsonValue }}
                    params={{ darkPlayIcon: darkPlayIcon, useModal: '1' }}
                    playButtonClassName="absolute [&_svg]:size-8  [&_svg]:bottom-7 [&_svg]:right-7 [&_svg]:absolute"
                  />
                ) : (
                  <ImageWrapper image={imageRequired?.jsonValue} />
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="PageHeader" />;
};
