import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface SubscriptionBannerParams {
  [key: string]: any; // eslint-disable-line
}

interface SubscriptionBannerFields {
  titleRequired: Field<string>;
  descriptionOptional?: Field<string>;
  buttonLink: LinkField;
  emailPlaceholder?: Field<string>;
  emailErrorMessage?: Field<string>;
  thankYouMessage?: Field<string>;
}

export interface SubscriptionBannerProps extends ComponentProps {
  params: SubscriptionBannerParams;
  fields: SubscriptionBannerFields;
}
