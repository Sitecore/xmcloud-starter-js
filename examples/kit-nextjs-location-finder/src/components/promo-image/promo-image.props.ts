import { ImageField, Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { EnumValues } from '@/enumerations/generic.enum';
import { ColorSchemeLimited } from '@/enumerations/ColorSchemeLimited.enum';
import { ComponentProps } from '@/lib/component-props';

export interface PromoImageParams {
  colorScheme?: EnumValues<typeof ColorSchemeLimited>;
  [key: string]: any; // eslint-disable-line
}

interface PromoImageFields {
  image: ImageField;
  heading: Field<string>;
  description?: Field<string>;
  link: LinkField;
}

export interface PromoImageProps extends ComponentProps {
  params: PromoImageParams;
  fields: PromoImageFields;
  isPageEditing?: boolean;
}
