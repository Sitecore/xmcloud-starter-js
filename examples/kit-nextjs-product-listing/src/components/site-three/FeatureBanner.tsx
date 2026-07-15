'use client';

import { Text as ContentSdkText, NextImage as ContentSdkImage } from '@sitecore-content-sdk/nextjs';
import { useMemo } from 'react';
import type { FeatureBannerProps, FeatureItemFields } from './feature-banner.props';
import { getDatasource, getFieldValue } from '@/lib/component-props';
import { NoDataFallback } from '@/utils/NoDataFallback';

const FeatureItem = (props: FeatureItemFields) => {
  return (
    <div className="flex flex-col items-center gap-1">
      <ContentSdkImage field={getFieldValue(props?.image)} className="w-6 h-6 object-contain" />
      <p className="text-base text-center">
        <ContentSdkText field={getFieldValue(props?.heading)} />
      </p>
    </div>
  );
};

export const Default = (props: FeatureBannerProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <NoDataFallback componentName="FeatureBanner" />;
  }

  return (
    <section className={`py-16 ${props?.params?.styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 py-12 border-t border-b border-border">
          <h2 className="text-2xl lg:text-5xl uppercase">
            <ContentSdkText field={getFieldValue(datasource?.title)} />
          </h2>
          <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-8">
            {datasource?.children?.results?.map((item) => (
              <FeatureItem key={item.id} {...item} />
            )) || []}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Vertical = (props: FeatureBannerProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <NoDataFallback componentName="FeatureBanner" />;
  }

  return (
    <section className={`py-16 ${props?.params?.styles}`} data-class-change>
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 lg:gap-12 py-12 border-t border-b border-border">
          <h2 className="text-2xl lg:text-5xl uppercase">
            <ContentSdkText field={getFieldValue(datasource?.title)} />
          </h2>
          <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-10">
            {datasource?.children?.results?.map((item) => (
              <FeatureItem key={item.id} {...item} />
            )) || []}
          </div>
        </div>
      </div>
    </section>
  );
};

export const Accent = (props: FeatureBannerProps) => {
  const datasource = useMemo(() => getDatasource(props.fields), [props.fields]);

  if (!datasource) {
    return <NoDataFallback componentName="FeatureBanner" />;
  }

  return (
    <section
      className={`py-16 border-t border-b border-border ${props?.params?.styles}`}
      data-class-change
    >
      <div className="bg-primary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-8 py-12">
            <h2 className="text-2xl lg:text-5xl uppercase">
              <ContentSdkText field={getFieldValue(datasource?.title)} />
            </h2>
            <div className="flex flex-wrap lg:flex-nowrap justify-center items-start gap-8">
              {datasource?.children?.results?.map((item) => (
                <FeatureItem key={item.id} {...item} />
              )) || []}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
