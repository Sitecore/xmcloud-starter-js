import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { JSX } from 'react';

export interface PromoFields {
  PromoIcon?: ImageField;
  PromoText?: Field<string>;
  PromoLink?: LinkField;
  PromoText2?: Field<string>;
  PromoText3?: Field<string>;
}

export type PromoProps = {
  params: { [key: string]: string };
  fields?: PromoFields;
};

export type PromoDefaultComponentProps = PromoProps & {
  children?: JSX.Element;
};
