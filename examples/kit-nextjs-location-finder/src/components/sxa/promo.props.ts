import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type PromoFields = {
  PromoIcon?: ImageField;
  PromoText?: Field<string>;
  PromoLink?: LinkField;
  PromoText2?: Field<string>;
  PromoText3?: Field<string>;
};

export type PromoProps = OptionalComponentProps & {
  fields?: PromoFields;
};

