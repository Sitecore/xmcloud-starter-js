import { IconName } from '@/enumerations/Icon.enum';
import { EnumValues } from '@/enumerations/generic.enum';
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

export type CardProps = {
  heading: Field<string>; // Sitecore editable text field
  description: Field<string>;
  image?: ImageField; // Sitecore editable image field
  link: LinkField; // Sitecore editable link field
  icon?: EnumValues<typeof IconName>;
  className?: string;
  editable?: boolean;
};
