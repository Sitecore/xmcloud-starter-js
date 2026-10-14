'use client';

import { Text as ContentSdkText, NextImage as ContentSdkImage } from '@sitecore-content-sdk/nextjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FeatureBannerProps, FeatureItemFields } from './feature-banner.props';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { NoDataFallback } from '@/utils/NoDataFallback';
import { cn } from '@/lib/utils';

const DARK_THEME_CLASS = 'dark-theme';

const isDarkThemeStyle = (styles?: string): boolean =>
  Boolean(
    styles
      ?.split(/[\s|]+/)
      .map((token) => token.trim())
      .includes(DARK_THEME_CLASS)
  );

const useDarkTheme = (styles?: string) => {
  const ref = useRef<HTMLElement | null>(null);
  const fromParams = isDarkThemeStyle(styles);
  const [fromDom, setFromDom] = useState(fromParams);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setFromDom(fromParams);
      return;
    }

    const sync = () =>
      setFromDom(element.classList.contains(DARK_THEME_CLASS) || fromParams);

    sync();
    const observer = new MutationObserver(sync);
    observer.observe(element, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [fromParams]);

  return { ref, isDarkTheme: fromParams || fromDom };
};

const featureItemsRowClassName =
  'flex w-full min-w-0 flex-1 flex-wrap items-start justify-evenly';

const FeatureItem = ({
  isDarkTheme,
  ...props
}: FeatureItemFields & { isDarkTheme?: boolean }) => {
  return (
    <div
      className={cn(
        'flex min-w-[6.5rem] flex-1 basis-0 flex-col items-center justify-start gap-1 px-2',
        isDarkTheme && 'text-primary-foreground'
      )}
    >
      <ContentSdkImage
        field={getFieldValue(props?.image)}
        className={cn('h-6 w-6 object-contain', isDarkTheme && 'brightness-0 invert')}
      />
      <p className={cn('text-center', isDarkTheme ? 'text-sm text-primary-foreground' : 'text-base')}>
        <ContentSdkText field={getFieldValue(props?.heading)} />
      </p>
    </div>
  );
};

const FeatureBannerFallback = () => <NoDataFallback componentName="FeatureBanner" />;

export const Default = (props: FeatureBannerProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const { ref, isDarkTheme } = useDarkTheme(props?.params?.styles);

  if (!datasource) {
    return <FeatureBannerFallback />;
  }

  return (
    <section
      ref={ref}
      className={cn(
        isDarkTheme ? 'bg-primary py-6' : 'py-16',
        props?.params?.styles,
        isDarkTheme && DARK_THEME_CLASS
      )}
      data-class-change
      data-feature-banner-theme={isDarkTheme ? 'dark' : 'default'}
    >
      <div className={cn(isDarkTheme ? 'w-full px-6 lg:px-12' : 'container mx-auto px-4')}>
        <div
          className={cn(
            'flex w-full flex-col items-stretch gap-6 lg:flex-row lg:items-center',
            isDarkTheme ? 'py-2' : 'border-b border-t border-border py-12'
          )}
        >
          <h2
            className={cn(
              'shrink-0 text-center lg:text-left',
              isDarkTheme
                ? 'text-xl font-normal text-primary-foreground lg:text-2xl'
                : 'text-2xl uppercase lg:text-5xl'
            )}
          >
            <ContentSdkText field={getFieldValue(datasource?.title)} />
          </h2>
          <div className={featureItemsRowClassName} data-testid="feature-banner-items">
            {datasource?.children?.results?.map((item) => (
              <FeatureItem key={item.id} {...item} isDarkTheme={isDarkTheme} />
            )) || []}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Vertical = (props: FeatureBannerProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const { ref, isDarkTheme } = useDarkTheme(props?.params?.styles);

  if (!datasource) {
    return <FeatureBannerFallback />;
  }

  return (
    <section
      ref={ref}
      className={cn(
        isDarkTheme ? 'bg-primary py-6' : 'py-16',
        props?.params?.styles,
        isDarkTheme && DARK_THEME_CLASS
      )}
      data-class-change
      data-feature-banner-theme={isDarkTheme ? 'dark' : 'default'}
    >
      <div className={cn(isDarkTheme ? 'w-full px-6 lg:px-12' : 'container mx-auto px-4')}>
        <div
          className={cn(
            'flex flex-col items-center gap-8 lg:gap-12',
            isDarkTheme ? 'py-2' : 'border-b border-t border-border py-12'
          )}
        >
          <h2
            className={cn(
              isDarkTheme
                ? 'text-xl font-normal text-primary-foreground lg:text-2xl'
                : 'text-2xl uppercase lg:text-5xl'
            )}
          >
            <ContentSdkText field={getFieldValue(datasource?.title)} />
          </h2>
          <div className={featureItemsRowClassName} data-testid="feature-banner-items">
            {datasource?.children?.results?.map((item) => (
              <FeatureItem key={item.id} {...item} isDarkTheme={isDarkTheme} />
            )) || []}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Accent = (props: FeatureBannerProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);
  const { ref, isDarkTheme } = useDarkTheme(props?.params?.styles);

  if (!datasource) {
    return <FeatureBannerFallback />;
  }

  return (
    <section
      ref={ref}
      className={cn(
        'border-b border-t border-border py-16',
        isDarkTheme && 'border-transparent',
        props?.params?.styles,
        isDarkTheme && DARK_THEME_CLASS
      )}
      data-class-change
      data-feature-banner-theme={isDarkTheme ? 'dark' : 'default'}
    >
      <div className="bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex w-full flex-col items-stretch gap-6 py-12 lg:flex-row lg:items-center">
            <h2
              className={cn(
                'shrink-0 text-center text-2xl uppercase lg:text-left lg:text-5xl',
                isDarkTheme && 'text-primary-foreground'
              )}
            >
              <ContentSdkText field={getFieldValue(datasource?.title)} />
            </h2>
            <div className={featureItemsRowClassName} data-testid="feature-banner-items">
              {datasource?.children?.results?.map((item) => (
                <FeatureItem key={item.id} {...item} isDarkTheme={isDarkTheme} />
              )) || []}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
