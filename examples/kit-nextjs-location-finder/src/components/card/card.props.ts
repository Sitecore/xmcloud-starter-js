import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';
import type { EnumValues } from '@/enumerations/generic.enum';
import type { IconName } from '@/enumerations/Icon.enum';

export type CardFields = {
  heading: Field<string>;
  description: Field<string>;
  image?: ImageField;
  link: LinkField;
};

export type CardParams = {
  icon?: EnumValues<typeof IconName>;
  className?: string;
  editable?: boolean;
  [key: string]: unknown;
};

export type CardProps = OptionalComponentProps & {
  fields: CardFields;
  params?: CardParams;
};

