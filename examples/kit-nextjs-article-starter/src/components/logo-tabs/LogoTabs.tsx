import { useState } from 'react';
import { Text, Image, Field, useSitecore } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { LogoTabsProps } from './logo-tabs.props';
import { LogoItem } from './LogoItem';
import { EditableButton as Button } from '@/components/button-component/ButtonComponent';
import { cn } from '@/lib/utils';

export const Default: React.FC<LogoTabsProps> = ({ fields, isPageEditing: propIsPageEditing }) => {
  const { page } = useSitecore();
  const isPageEditing = propIsPageEditing || page.mode.isEditing;
  const { title, backgroundImage, logos, logoTabContent } = fields?.data?.datasource ?? {};
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Only use default placeholder count when not in editing mode
    const tabCount = logos?.results?.length || (!isPageEditing ? 4 : 0);
    // Skip keyboard navigation if there are no tabs
    if (tabCount === 0) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        setActiveTabIndex((prev) => (prev + 1) % tabCount);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        setActiveTabIndex((prev) => (prev - 1 + tabCount) % tabCount);
        break;
      case 'Home':
        event.preventDefault();
        setActiveTabIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveTabIndex(tabCount - 1);
        break;
    }
  };

  // Placeholder data for empty state
  const placeholderLogos = Array(4).fill({
    title: { jsonValue: { value: 'Brand Name' } },
    logo: {
      jsonValue: {
        value: {
          src: '/img/LOGO-placeholder.png',
          alt: 'Brand Logo',
          width: 200,
          height: 100,
        },
      },
    },
  });

  const placeholderContent = Array(4).fill({
    heading: {
      jsonValue: {
        value: 'Click to edit brand content',
      } as Field<string>,
    },
    cta: {
      jsonValue: {
        value: {
          text: 'Click to edit CTA',
          linktype: 'internal',
          url: '#',
          anchor: '',
          target: '',
        },
      },
    },
  });

  if (fields) {
    const hasLogos = logos?.results && logos.results.length > 0;
    const hasContent = logoTabContent?.results && logoTabContent.results.length > 0;
    // Only use placeholders when not in editing mode
    const logosData =
      hasLogos && logos?.results ? logos.results : !isPageEditing ? placeholderLogos : [];
    const contentData =
      hasContent && logoTabContent?.results
        ? logoTabContent.results
        : !isPageEditing
          ? placeholderContent
          : [];
    const hasBackgroundImage = !!backgroundImage?.jsonValue?.value?.src;

    return (
      <div className={cn('text-primary-foreground relative min-h-[800px] w-full overflow-hidden')}>
        {/* Background Image */}
        {hasBackgroundImage ? (
          <div className="absolute inset-0">
            <Image field={backgroundImage?.jsonValue} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/80" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />
        )}

        {/* Content */}
        <div className="@container relative z-10 mx-auto max-w-7xl px-4 py-[88px] sm:px-6 lg:px-8">
          {/* Title */}
          {title?.jsonValue?.value ? (
            <Text
              tag="h2"
              field={title.jsonValue}
              className="font-heading text-primary-foreground mb-11 font-light tracking-tight [font-size:clamp(3rem,2.143rem_+_2.857cqi,4.5rem)]"
            />
          ) : (
            <Text
              tag="h2"
              field={{ value: 'Click to edit title' }}
              className="font-heading text-primary-foreground mb-11 font-light tracking-tight [font-size:clamp(3rem,2.143rem_+_2.857cqi,4.5rem)]"
            />
          )}

          {/* Empty State Message in Editing Mode */}
          {isPageEditing && !hasLogos ? (
            <div className="text-center text-white">
              <p className="text-lg opacity-70">Add a logo tab item to edit.</p>
            </div>
          ) : (
            <>
              {/* If in editing mode with data, display all items stacked */}
              {isPageEditing && hasLogos ? (
                <div className="space-y-10">
                  {logosData.map((logo, index) => (
                    <div key={index} className="border-b border-white/20 pb-10 last:border-0">
                      <div className="mb-6 flex items-center">
                        <div className="rounded-[20px] bg-white px-6 py-3 shadow-lg">
                          <Image field={logo?.logo?.jsonValue} className="h-6 w-auto" />
                        </div>
                        <div className="ml-4 text-lg text-white opacity-70">
                          <Text field={logo?.title?.jsonValue} />
                        </div>
                      </div>

                      <div className="max-w-lg">
                        <Text
                          tag="h3"
                          field={
                            contentData[index]?.heading?.jsonValue || {
                              value: 'Click to edit content',
                            }
                          }
                          className="font-heading text-primary-foreground mb-4 text-2xl font-medium leading-tight md:text-3xl"
                        />
                        <Button
                          buttonLink={contentData[index]?.cta?.jsonValue}
                          variant="rounded-white"
                          className="font-heading px-8 py-2.5 text-sm font-medium"
                          isPageEditing={isPageEditing}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Logo Navigation Container */}
                  {(!isPageEditing || (isPageEditing && logosData.length > 0)) && (
                    <>
                      <div className="@container mb-28">
                        {/* Logo Navigation */}
                        <div
                          role="tablist"
                          aria-label={title?.jsonValue?.value || 'Brand tabs'}
                          className="@md:flex-row @md:justify-between flex w-full flex-col gap-4"
                          onKeyDown={handleKeyDown}
                        >
                          {logosData.map((logo, index) => (
                            <LogoItem
                              key={index}
                              {...logo}
                              isActive={activeTabIndex === index}
                              onClick={() => setActiveTabIndex(index)}
                              id={`tab-${index}`}
                              controls={`panel-${index}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Tab Panels Container */}
                      <div aria-live="polite">
                        {contentData.map((content, index) => (
                          <div
                            key={index}
                            role="tabpanel"
                            id={`panel-${index}`}
                            aria-labelledby={`tab-${index}`}
                            className={cn(
                              'max-w-lg transition-[visibility,opacity] duration-300',
                              activeTabIndex === index
                                ? 'visible opacity-100'
                                : 'invisible absolute opacity-0'
                            )}
                            hidden={activeTabIndex !== index}
                          >
                            <Text
                              tag="h3"
                              field={
                                content.heading?.jsonValue || { value: 'Click to edit content' }
                              }
                              className="font-heading text-primary-foreground mb-4 text-2xl font-medium leading-tight md:text-3xl"
                            />
                            <Button
                              buttonLink={content.cta?.jsonValue}
                              variant="rounded-white"
                              className="font-heading px-8 py-2.5 text-sm font-medium"
                              isPageEditing={isPageEditing}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="LogoTabs" />;
};
