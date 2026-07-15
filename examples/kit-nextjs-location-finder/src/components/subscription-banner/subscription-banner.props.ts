import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type SubscriptionBannerParams = {
  [key: string]: unknown;
};

export type SubscriptionBannerFields = {
  titleRequired: Field<string>;
  descriptionOptional?: Field<string>;
  buttonLink: LinkField;
  emailPlaceholder?: Field<string>;
  emailErrorMessage?: Field<string>;
  thankYouMessage?: Field<string>;
};

export type SubscriptionBannerProps = OptionalComponentProps & {
  params: SubscriptionBannerParams;
  fields: SubscriptionBannerFields;
};

