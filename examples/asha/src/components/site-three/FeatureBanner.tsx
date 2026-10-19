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
  shape = 'icon',
  ...props
}: FeatureItemFields & { isDarkTheme?: boolean; shape?: 'icon' | 'circle' }) => {
  const isCircle = shape === 'circle';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-start',
        isCircle ? 'w-28 gap-3 sm:w-36 lg:w-40' : 'min-w-[6.5rem] flex-1 basis-0 gap-1 px-2',
        isDarkTheme && 'text-primary-foreground'
      )}
    >
      <ContentSdkImage
        field={getFieldValue(props?.image)}
        className={cn(
          isCircle
            ? 'aspect-square w-full rounded-full object-cover'
            : 'h-6 w-6 object-contain',
          isDarkTheme && !isCircle && 'brightness-0 invert'
        )}
      />
      <p
        className={cn(
          'text-center',
          isCircle ? 'text-sm text-black' : 'text-base',
          isDarkTheme && 'text-primary-foreground'
        )}
      >
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
  const titleField = getFieldValue(datasource?.title);
  const subTitleField = getFieldValue(datasource?.subTitle);

  if (!datasource) {
    return <FeatureBannerFallback />;
  }

  return (
    <section
      ref={ref}
      className={cn(
        isDarkTheme ? 'bg-primary py-10' : 'bg-background py-14 md:py-16',
        props?.params?.styles,
        isDarkTheme && DARK_THEME_CLASS
      )}
      data-class-change
      data-feature-banner-theme={isDarkTheme ? 'dark' : 'default'}
      data-testid="feature-banner-vertical"
    >
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-6xl flex-col items-center text-center">
          <h2
            className={cn(
              'max-w-4xl text-2xl font-bold tracking-tight md:text-3xl',
              isDarkTheme ? 'text-primary-foreground' : 'text-black'
            )}
          >
            <ContentSdkText field={titleField} />
          </h2>
          {subTitleField && (
            <p
              className={cn(
                'mt-3 text-lg font-normal md:text-xl',
                isDarkTheme ? 'text-primary-foreground' : 'text-black'
              )}
              data-testid="feature-banner-subtitle"
            >
              <ContentSdkText field={subTitleField} />
            </p>
          )}
          <div
            className="mt-10 flex w-full flex-wrap items-start justify-center gap-x-6 gap-y-8 sm:gap-x-10"
            data-testid="feature-banner-items"
          >
            {datasource?.children?.results?.map((item) => (
              <FeatureItem key={item.id} {...item} isDarkTheme={isDarkTheme} shape="circle" />
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
