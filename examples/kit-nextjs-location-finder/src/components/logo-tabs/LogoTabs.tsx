'use client';

import { useState } from 'react';
import { Text, Image } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { LogoTabsProps } from './logo-tabs.props';
import { LogoItem } from './LogoItem';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { cn } from '@/lib/utils';
import { getDatasource, getFieldValue } from '@/lib/component-props';

// Default display of the component

export const Default: React.FC<LogoTabsProps> = ({ fields }) => {
  const datasource = getDatasource(fields);
  const { title, backgroundImage, logos, logoTabContent } = datasource || {};
  const titleField = getFieldValue(title);
  const backgroundImageField = getFieldValue(backgroundImage);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const tabCount = logos?.results?.length || 0;

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

  if (fields) {
    return (
      <div className="relative min-h-[800px] w-full overflow-hidden">
        {/* Background Image */}
        {backgroundImageField?.value?.src && (
          <div className="absolute inset-0">
            <Image field={backgroundImageField} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-black/80" />
          </div>
        )}

        {/* Content */}
        <div className="@container relative z-10 mx-auto max-w-7xl px-4 py-[88px] sm:px-6 lg:px-8">
          {/* Title */}
          {titleField && (
            <Text
              tag="h2"
              field={titleField}
              className="font-heading text-primary-foreground mb-11 font-light tracking-tight [font-size:clamp(3rem,2.143rem_+_2.857cqi,4.5rem)]"
            />
          )}

          {/* Logo Navigation Container */}
          <div className="@container mb-28">
            {/* Logo Navigation */}
            {logos?.results && logos.results.length > 0 && (
              <div
                role="tablist"
                aria-label={titleField?.value || 'Brand tabs'}
                className="@md:flex-row @md:justify-between flex w-full flex-col gap-4"
                onKeyDown={handleKeyDown}
              >
                {logos.results.map((logo, index) => (
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
            )}
          </div>

          {/* Tab Panels Container */}
          <div aria-live="polite">
            {logoTabContent?.results &&
              logoTabContent.results.map((content, index) => {
                const headingField = getFieldValue(content?.heading);
                const ctaField = getFieldValue(content?.cta);

                return (
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
                  {headingField && (
                    <Text
                      tag="h3"
                      field={headingField}
                      className="font-heading text-primary-foreground mb-4 text-2xl font-medium leading-tight md:text-3xl"
                    />
                  )}
                  {ctaField && (
                    <Button
                      buttonLink={ctaField}
                      variant="rounded-white"
                      className="font-heading px-8 py-2.5 text-sm font-medium"
                    />
                  )}
                </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  return <NoDataFallback componentName="LogoTabs" />;
};
