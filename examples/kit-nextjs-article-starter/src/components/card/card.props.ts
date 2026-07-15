import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { IconName } from '@/enumerations/Icon.enum';
import { EnumValues } from '@/enumerations/generic.enum';

export type CardProps = {
  heading: Field<string>;
  description: Field<string>;
  image?: ImageField;
  link: LinkField;
  icon?: EnumValues<typeof IconName>;
  className?: string;
  editable?: boolean;
};
