import { ImageField, Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { EnumValues } from '@/enumerations/generic.enum';
import { ColorSchemeLimited } from '@/enumerations/ColorSchemeLimited.enum';
import { ComponentProps } from '@/lib/component-props';
export interface PromoAnimatedParams {
  colorScheme?: EnumValues<typeof ColorSchemeLimited>;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
interface PromoAnimatedFields {
  image: ImageField;
  title: Field<string>;
  description?: Field<string>;
  primaryLink?: LinkField;
  secondaryLink?: LinkField;
}

export interface PromoAnimatedProps extends ComponentProps {
  params: PromoAnimatedParams;
  fields: PromoAnimatedFields;
  isPageEditing?: boolean;
}
