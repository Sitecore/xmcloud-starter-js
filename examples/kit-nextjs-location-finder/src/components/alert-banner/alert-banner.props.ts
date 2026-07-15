import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type AlertBannerParams = {
  mock_param?: string;
  [key: string]: unknown;
};

export type AlertBannerFields = {
  title: Field<string>;
  description: Field<string>;
  image?: ImageField;
  link?: LinkField;
};

export type AlertBannerData = {
  externalFields: {
    mock_external_data: Field<string>;
  };
};

export type AlertBannerProps = OptionalComponentProps & {
  params: AlertBannerParams;
  fields: AlertBannerFields;
  externalFields: AlertBannerData['externalFields'];
};

