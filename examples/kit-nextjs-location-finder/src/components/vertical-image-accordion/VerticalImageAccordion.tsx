'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { m, AnimatePresence } from 'framer-motion';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import type { VerticalImageAccordionProps } from './vertical-image-accordion.props';

export const Default: React.FC<VerticalImageAccordionProps> = (props) => {
  const { fields, page } = props;
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [isExpanding, setIsExpanding] = useState(false);

  const datasource = getDatasource(fields);
  const { title, items } = datasource ?? {};
  const titleField = getFieldValue(title);

  const handleClick = (index: number) => {
    setIsExpanding(true);
    setActiveIndex(index);
    // Reset expanding state after animation completes
    setTimeout(() => setIsExpanding(false), 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(index);
    }
  };

  if (fields) {
    return (
      <div
        className="relative mx-auto max-w-7xl my-6 px-4 py-16 sm:px-6 lg:px-8 @container bg-primary rounded-default"
        role="region"
        aria-label={titleField?.value || 'Image Accordion'}
      >
        {titleField && (
          <Text
            tag="h2"
            field={titleField}
            className="mb-16 text-4xl font-heading font-light tracking-tight text-primary-foreground @lg:text-6xl"
          />
        )}

        <div
          className="flex flex-col @md:flex-row gap-14"
          role="tablist"
          aria-orientation="vertical"
        >
          {items?.results.map((item, index) => {
            const imageField = getFieldValue(item?.image);
            const titleItemField = getFieldValue(item?.title);
            const descriptionField = getFieldValue(item?.description);
            const ctaField = getFieldValue(item?.cta);

            return (
            <m.div
              key={index}
              className={cn(
                'group flex flex-col overflow-hidden rounded-lg transition-all duration-500',
                'h-[120px] cursor-pointer',
                activeIndex === index && 'h-auto',
                '@md:h-auto',
                activeIndex === index ? '@md:flex-1' : '@md:w-[170px] @md:flex-none'
              )}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls={`panel-${index}`}
              aria-expanded={activeIndex === index}
              tabIndex={0}
              initial={false}
            >
              {/* Image Container */}
              <div
                className={cn(
                  'relative transition-all duration-500',
                  'h-[120px]',
                  activeIndex === index && 'h-[300px]',
                  '@md:h-[513px]'
                )}
                role="img"
                aria-label={imageField?.value?.alt?.toString() || `Image ${index + 1}`}
              >
                {imageField && (
                  <ImageWrapper
                    image={imageField}
                    className="rounded-default h-full w-full object-cover"
                    wrapperClass="h-full w-full"
                    aria-hidden="true"
                    page={page}
                  />
                )}
              </div>

              {/* Content section */}
              <div
                className={cn(
                  'flex flex-col py-6',
                  '@md:h-auto @md:overflow-visible',
                  '@md:opacity-100'
                )}
                role="tabpanel"
                id={`panel-${index}`}
                aria-labelledby={`tab-${index}`}
                hidden={activeIndex !== index}
              >
                {/* Title handling */}
                <div
                  className={cn(
                    'transition-opacity duration-300',
                    activeIndex === index ? 'block' : 'hidden',
                    '@md:block',
                    '@md:opacity-100',
                    activeIndex === index && isExpanding && '@md:opacity-0'
                  )}
                >
                  {titleItemField && (
                    <Text
                      tag="h3"
                      field={titleItemField}
                      className="font-accent text-2xl font-medium text-primary-foreground"
                      id={`tab-${index}`}
                    />
                  )}
                </div>

                {/* Description and CTA */}
                <AnimatePresence>
                  {activeIndex === index && !isExpanding && (
                    <m.div
                      className="flex flex-col gap-4 overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: { duration: 0.2 },
                      }}
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                        opacity: { delay: 0.2 },
                      }}
                    >
                      {descriptionField && (
                        <Text
                          tag="p"
                          field={descriptionField}
                          className="mt-2 text-primary-foreground"
                        />
                      )}
                      {ctaField && (
                        <Button
                          buttonLink={ctaField}
                          variant="secondary"
                          className="mt-4 inline-flex w-fit items-center justify-center px-8 py-2.5 text-sm font-heading font-medium"
                          aria-label={`Learn more about ${titleItemField?.value || ''}`}
                        />
                      )}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.div>
            );
          })}
        </div>
      </div>
    );
  }
  return <NoDataFallback componentName="VerticalImageAccordion" />;
};
