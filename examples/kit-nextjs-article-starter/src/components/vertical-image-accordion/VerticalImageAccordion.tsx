import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Text, Link } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { VerticalImageAccordionProps } from './vertical-image-accordion.props';
import { EditableButton } from '@/components/button-component/ButtonComponent';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

export const Default: React.FC<VerticalImageAccordionProps> = ({ fields, isPageEditing }) => {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [isExpanding, setIsExpanding] = useState(false);
  const { page } = useSitecore();
  const isEditMode = isPageEditing || page.mode.isEditing;

  if (!fields?.data?.datasource) {
    return <NoDataFallback componentName="VerticalImageAccordion" />;
  }

  const handleClick = (index: number) => {
    // Only animate if clicking a different item
    if (activeIndex !== index) {
      setIsExpanding(true);
      // Allow time for content to collapse first before changing activeIndex
      setTimeout(() => {
        setActiveIndex(index);
        // Reset expanding state after animation completes
        setTimeout(() => setIsExpanding(false), 300);
      }, 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(index);
    }
  };

  const { title, items } = fields.data.datasource;

  // When in editor mode, render all items stacked
  if (isEditMode) {
    return (
      <div
        className="@container bg-primary rounded-default text-primary-foreground relative mx-auto my-6 max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        role="region"
        aria-label={title?.jsonValue?.value || 'Image Accordion'}
      >
        {title?.jsonValue && (
          <Text
            tag="h2"
            field={title.jsonValue}
            className="font-heading text-primary-foreground @lg:text-6xl mb-16 text-4xl font-light tracking-tight"
          />
        )}

        <div className="flex flex-col gap-14">
          {items?.results.map((item, index) => (
            <div key={index} className="flex flex-col overflow-hidden rounded-lg">
              <div
                className="@md:h-[513px] relative h-[300px]"
                role="img"
                aria-label={item?.image?.jsonValue?.value?.alt?.toString() || `Image ${index + 1}`}
              >
                {(isEditMode || item?.image?.jsonValue?.value?.src) && (
                  <ImageWrapper
                    image={item.image.jsonValue}
                    className="rounded-default h-full w-full object-cover"
                    wrapperClass="h-full w-full"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="flex flex-col py-6">
                {item.title && (
                  <Text
                    tag="h3"
                    field={item.title.jsonValue}
                    className="font-accent text-primary-foreground text-2xl font-medium"
                    id={`tab-${index}`}
                  />
                )}

                {item.description && (
                  <Text
                    tag="p"
                    field={item.description.jsonValue}
                    className="text-primary-foreground mt-2"
                  />
                )}

                {/* Always show CTA in edit mode, or only when data exists in normal mode */}
                {(isEditMode || item.link?.jsonValue) && (
                  <>
                    {isEditMode ? (
                      <div className="font-heading bg-secondary text-secondary-foreground mt-4 inline-flex w-fit items-center justify-center rounded px-8 py-2.5 text-sm font-medium">
                        <Link
                          field={
                            item.link?.jsonValue || {
                              value: {
                                text: 'Click to edit CTA',
                                href: '#',
                                url: '#',
                                linktype: 'internal',
                                anchor: '',
                                target: '',
                              },
                            }
                          }
                          editable={true}
                        />
                      </div>
                    ) : (
                      <EditableButton
                        buttonLink={
                          item.link?.jsonValue || {
                            value: {
                              text: '',
                              href: '',
                              url: '',
                              linktype: 'internal',
                              anchor: '',
                              target: '',
                            },
                          }
                        }
                        variant="secondary"
                        className="font-heading mt-4 inline-flex w-fit items-center justify-center px-8 py-2.5 text-sm font-medium"
                        aria-label={`Learn more about ${item.title?.jsonValue?.value || ''}`}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Normal interactive mode
  return (
    <div
      className="@container bg-primary rounded-default text-primary-foreground relative mx-auto my-6 max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      role="region"
      aria-label={title?.jsonValue?.value || 'Image Accordion'}
    >
      {title?.jsonValue && (
        <Text
          tag="h2"
          field={title.jsonValue}
          className="font-heading text-primary-foreground @lg:text-6xl mb-16 text-4xl font-light tracking-tight"
        />
      )}

      <div
        className="@md:flex-row flex flex-col gap-[53px]"
        role="tablist"
        aria-orientation="vertical"
      >
        {items?.results.map((item, index) => {
          const isActive = activeIndex === index;

          return (
            <div
              key={index}
              className={cn(
                'group flex cursor-pointer flex-col overflow-hidden rounded-lg transition-all',
                '@md:w-[270px]',
                isActive && '@md:w-full'
              )}
              style={{
                transitionDuration: '600ms',
                transitionProperty: 'width, height',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${index}`}
              aria-expanded={isActive}
              tabIndex={0}
            >
              {/* Image Container */}
              <div
                className={cn(
                  'relative overflow-hidden transition-all',
                  '@md:h-[513px]',
                  'h-[170px]',
                  // Only apply the height increase on mobile/smaller screens
                  isActive && !isExpanding && 'h-[350px]'
                )}
                style={{
                  transitionDuration: '600ms',
                  transitionProperty: 'height',
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                role="img"
                aria-label={item?.image?.jsonValue?.value?.alt?.toString() || `Image ${index + 1}`}
              >
                {(isEditMode || item?.image?.jsonValue?.value?.src) && (
                  <div className="absolute inset-0">
                    <div className="h-full w-full">
                      <ImageWrapper
                        image={item.image.jsonValue}
                        className="rounded-default h-full w-full object-cover"
                        wrapperClass="h-full w-full"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Content section - Positioned below image */}
              <div
                className={cn('flex flex-col py-6', '@md:opacity-100')}
                role="tabpanel"
                id={`panel-${index}`}
                aria-labelledby={`tab-${index}`}
                hidden={!isActive}
              >
                {/* Title handling - Always visible for active item */}
                <div className="transition-opacity duration-500">
                  {item.title && (
                    <Text
                      tag="h3"
                      field={item.title.jsonValue}
                      className="font-accent text-primary-foreground text-2xl font-medium"
                      id={`tab-${index}`}
                    />
                  )}
                </div>

                {/* Description and CTA */}
                <div
                  className={cn(
                    'flex flex-col gap-4 overflow-hidden',
                    isExpanding && 'h-0 opacity-0',
                    !isExpanding && isActive && 'animate-expand-content'
                  )}
                  style={{
                    maxHeight: isExpanding || !isActive ? '0' : '500px',
                    opacity: isExpanding || !isActive ? 0 : 1,
                    visibility: isActive ? 'visible' : 'hidden',
                    transitionProperty: 'opacity, max-height',
                    transitionDuration: '700ms',
                    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    transitionDelay: !isActive && !isExpanding ? '500ms' : '0s',
                  }}
                >
                  {item.description && (
                    <Text
                      tag="p"
                      field={item.description.jsonValue}
                      className="text-primary-foreground mt-2"
                    />
                  )}
                  {/* Always show CTA in edit mode, or only when data exists in normal mode */}
                  {(isEditMode || item.link?.jsonValue) && (
                    <>
                      {isEditMode ? (
                        <div className="font-heading bg-secondary text-secondary-foreground mt-4 inline-flex w-fit items-center justify-center rounded px-8 py-2.5 text-sm font-medium">
                          <Link
                            field={
                              item.link?.jsonValue || {
                                value: {
                                  text: 'Click to edit CTA',
                                  href: '#',
                                  url: '#',
                                  linktype: 'internal',
                                  anchor: '',
                                  target: '',
                                },
                              }
                            }
                            editable={true}
                          />
                        </div>
                      ) : (
                        <EditableButton
                          buttonLink={
                            item.link?.jsonValue || {
                              value: {
                                text: '',
                                href: '',
                                url: '',
                                linktype: 'internal',
                                anchor: '',
                                target: '',
                              },
                            }
                          }
                          variant="secondary"
                          className="font-heading mt-4 inline-flex w-fit items-center justify-center px-8 py-2.5 text-sm font-medium"
                          aria-label={`Learn more about ${item.title?.jsonValue?.value || ''}`}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
