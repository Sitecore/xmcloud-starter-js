import { CompatibleField, ComponentProps } from 'lib/component-props';
import { ImageField, Field, LinkField } from '@sitecore-content-sdk/nextjs';
import type { JSX } from 'react';

export interface PromoFields {
  PromoIcon?: CompatibleField<ImageField>;
  PromoText?: CompatibleField<Field<string>>;
  PromoLink?: CompatibleField<LinkField>;
  PromoText2?: CompatibleField<Field<string>>;
}

export type PromoProps = ComponentProps & {
  fields?: PromoFields;
};

export interface PromoContentProps extends PromoProps {
  renderText: (fields: PromoFields) => JSX.Element;
}
