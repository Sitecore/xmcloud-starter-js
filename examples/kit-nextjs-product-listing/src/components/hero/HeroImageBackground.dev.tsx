'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { ButtonBase } from '@/components/button-component/ButtonComponent';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import type { HeroFields, HeroProps } from './hero.props';

export const HeroImageBackground: React.FC<HeroProps> = (props) => {
  const { fields: initialFields, isPageEditing } = props;
  const [fields, setFields] = useState(initialFields || {});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
  }, []);

  useEffect(() => {
    const fetchPersonalizedContent = async () => {
      try {
        setIsLoading(true);
        // Select a random ID from the list
        // List of 10 possible IDs for personalization
        const possibleIds = [
          '45XixxP6MwsQQMXEyEFqvf',
          '6txC8Np0nFYHvbDfWO6Yq3',
          '2aITWZcsVlxCxvqYViXODs',
          '1zQ2kKlNv56JF8Ocqd06GW',
          '1F5HPS0POilcbAlgaS7p6A',
          '4ROMsF9ZRbga7WA1UlUnbe',
          '2tIyiWUJysTLkhdhJN3MVo',
          '2wFREt2N42HDSxeNR0SIvh',
          '1m8HHPaQXXNUjxgYnlJXqX',
          '1zQ2kKlNv56JF8Ocqd06GW',
        ];
        const randomIndex = Math.floor(Math.random() * possibleIds.length);
        const selectedId = possibleIds[randomIndex];

        const response = await fetch(`/api/content-service/heroDatasource/${selectedId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CONTENT_SERVICE_ACCESS_TbOKEN}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Update fields with personalized content
          const { title, description, bannerText, bannerCTA, heroImage } =
            data?.heroDatasource || {};
          const image = heroImage.value ? heroImage : { value: heroImage };
          const personalizedFields: HeroFields = {
            title: {
              value: title,
            },
            description: {
              value: description,
            },
            bannerText: {
              value: bannerText,
            },
            bannerCTA,
            image: image,
            dictionary: initialFields?.dictionary,
          };
          setFields(personalizedFields);
        }
      } catch (error) {
        console.error('Error fetching personalized content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch personalized content with 70% probability
    const shouldPersonalize = Math.random() < 0.7;
    console.debug('shouldPersonalize', shouldPersonalize);
    if (shouldPersonalize && !isPageEditing) {
      fetchPersonalizedContent();
    }
  }, [initialFields?.dictionary, isPageEditing]);

  if (fields) {
    const { title, description, bannerText, bannerCTA, image } = fields || {};
    const needsBanner: boolean = isPageEditing
      ? true
      : bannerText?.value !== '' || bannerCTA?.value?.href !== ''
        ? true
        : false;

    const hasPagesPositionStyles: boolean = props?.params?.styles
      ? props?.params?.styles.includes('position-')
      : false;

    return (
      <section
        data-component="Hero"
        className="@container/herowrapper bg-background text-foreground relative w-full overflow-hidden"
      >
        <div
          data-class-change
          className={cn('group relative', {
            'position-left': !hasPagesPositionStyles,
            [props?.params?.styles]: props?.params?.styles,
          })}
        >
          {/* Image */}
          <ImageWrapper
            image={image}
            wrapperClass="absolute w-full inset-0 scrim-background/50 scrim-l-full group-[.position-right]:scrim-r-full group-[.position-right]:scrim-l-0 group-[.position-center]:scrim-l-0 group-[.position-center]:scrim-b-full"
            className="h-full w-full object-cover opacity-80"
            priority={true}
            loading="eager"
            fetchPriority="high"
          />

          {/* Blur effect for mobile */}
          <div className="fade-to-transparent fade-to-transparent-bottom @md/herowrapper:hidden absolute inset-0 w-full backdrop-blur-sm"></div>

          {/* Content */}
          <div className="@container/herocontent @sm/herowrapper:px-5 @sm/herowrapper:pb-5 @md/herowrapper:px-10 @md/herowrapper:pb-10 @md/herowrapper:pt-10 @lg/herowrapper:px-10 @lg/herowrapper:pb-10 @lg/herowrapper:pt-10 relative z-10 mx-auto flex max-w-[1240px] flex-col pt-4 group-[.position-right]:items-end group-[.position-center]:items-center">
            <div className="w-6/16 p-10 bg-tertiary text-background">
              {isLoading && (
                <div className="absolute top-0 right-0 p-2 text-xs">
                  Loading personalized content...
                </div>
              )}

              {/* Title */}
              <AnimatedSection
                direction="up"
                className="relative z-20"
                isPageEditing={isPageEditing}
                reducedMotion={prefersReducedMotion}
              >
                <Text
                  tag="h1"
                  field={title}
                  className="font-heading text-3xl text-box-trim-both-baseline @lg/herowrapper:p-0 text-shadow text-shadow-blur-xl @sm/herowrapper:text-shadow-blur-3xl @sm/herowrapper:px-0 relative -ml-[2px] max-w-[13ch] text-balance px-5 font-light leading-tight drop-shadow-[0_35px_35px_rgba(0,0,0,0.4)]"
                />
              </AnimatedSection>

              {/* Line */}
              <div className="py-3">
                <div className="bg-foreground absolute left-1/2 h-[2px] w-[200vw] -translate-x-1/2"></div>
              </div>

              {/* Description */}
              <AnimatedSection
                direction="up"
                isPageEditing={isPageEditing}
                reducedMotion={prefersReducedMotion}
                delay={200}
              >
                {description && (
                  <Text
                    tag="p"
                    className="@xs/herocontent:text-sm @sm/herowrapper:px-0 text-shadow text-shadow-blur-xl max-w-[32ch] text-pretty px-5"
                    field={description}
                  />
                )}
              </AnimatedSection>

              {/* Banner overlay */}
              {needsBanner && (
                <div className="@container/herobanner bg-overlay text-primary-foreground z-10 w-full max-w-[50rem]">
                  <div className="@[35rem]/herobanner:flex-row @[35rem]/herobanner:items-center @[35rem]/herobanner:justify-between @[35rem]/herobanner:flex @[35rem]/herobanner:gap-10 @[35rem]/herobanner:text-left">
                    {bannerText && (
                      <AnimatedSection
                        direction="up"
                        isPageEditing={isPageEditing}
                        reducedMotion={prefersReducedMotion}
                      >
                        <Text
                          tag="p"
                          className="font-heading @md/herowrapper:text-lg text-pretty font-light leading-tight"
                          field={bannerText}
                        />
                      </AnimatedSection>
                    )}
                    {bannerCTA && (
                      <AnimatedSection
                        direction="up"
                        className="@[35rem]/herobanner:mt-0 mt-4"
                        isPageEditing={isPageEditing}
                        reducedMotion={prefersReducedMotion}
                        delay={200}
                      >
                        <ButtonBase
                          buttonLink={bannerCTA}
                          variant="default"
                          isPageEditing={isPageEditing}
                        />
                      </AnimatedSection>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="Hero" />;
};
