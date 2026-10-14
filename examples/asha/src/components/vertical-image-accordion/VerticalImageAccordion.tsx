'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { VerticalImageAccordionProps } from './vertical-image-accordion.props';
import { motion, AnimatePresence } from 'framer-motion';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { getDatasource, getFieldValue } from '@/lib/component-props';

export const Default: React.FC<VerticalImageAccordionProps> = ({ fields }) => {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [isExpanding, setIsExpanding] = useState(false);

  const datasource = getDatasource(fields) as
    | {
        title?: VerticalImageAccordionProps['fields']['data']['datasource']['title'];
        items?: VerticalImageAccordionProps['fields']['data']['datasource']['items'];
      }
    | undefined;
  const { title, items } = datasource ?? {};

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

  if (datasource) {
    return (
      <div
        className="relative mx-auto max-w-7xl my-6 px-4 py-16 sm:px-6 lg:px-8 @container bg-primary rounded-default"
        role="region"
        aria-label={getFieldValue(title)?.value || 'Image Accordion'}
      >
        {getFieldValue(title) && (
          <Text
            tag="h2"
            field={getFieldValue(title)}
            className="mb-16 text-4xl font-heading font-light tracking-tight text-primary-foreground @lg:text-6xl"
          />
        )}

        <div
          className="flex flex-col @md:flex-row gap-14"
          role="tablist"
          aria-orientation="vertical"
        >
          {items?.results.map((item, index) => (
            <motion.div
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
                aria-label={getFieldValue(item?.image)?.value?.alt?.toString() || `Image ${index + 1}`}
              >
                {getFieldValue(item?.image) && (
                  <ImageWrapper
                    image={getFieldValue(item.image)}
                    className="rounded-default h-full w-full object-cover"
                    wrapperClass="h-full w-full"
                    aria-hidden="true"
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
                  {getFieldValue(item?.title) && (
                    <Text
                      tag="h3"
                      field={getFieldValue(item.title)}
                      className="font-accent text-2xl font-medium text-primary-foreground"
                      id={`tab-${index}`}
                    />
                  )}
                </div>

                {/* Description and CTA */}
                <AnimatePresence>
                  {activeIndex === index && !isExpanding && (
                    <motion.div
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
                      {getFieldValue(item?.description) && (
                        <Text
                          tag="p"
                          field={getFieldValue(item.description)}
                          className="mt-2 text-primary-foreground"
                        />
                      )}
                      {getFieldValue(item?.cta) && (
                        <Button
                          buttonLink={getFieldValue(item.cta)!}
                          variant="secondary"
                          className="mt-4 inline-flex w-fit items-center justify-center px-8 py-2.5 text-sm font-heading font-medium"
                          aria-label={`Learn more about ${getFieldValue(item.title)?.value || ''}`}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="VerticalImageAccordion" />;
};
