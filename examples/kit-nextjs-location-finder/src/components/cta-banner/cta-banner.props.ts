import type { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';
import type { EnumValues } from '@/enumerations/generic.enum';
import type { ColorSchemeLimited as ColorScheme } from '@/enumerations/ColorSchemeLimited.enum';

export type CtaBannerParams = {
  colorScheme?: EnumValues<typeof ColorScheme>;
  [key: string]: unknown;
};

export type CtaBannerFields = {
  titleRequired?: Field<string>;
  descriptionOptional?: Field<string>;
  linkOptional?: LinkField;
};

export type CtaBannerProps = OptionalComponentProps & {
  params: CtaBannerParams;
  fields?: CtaBannerFields;
};

