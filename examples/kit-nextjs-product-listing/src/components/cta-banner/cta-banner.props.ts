import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { ColorSchemeLimited as ColorScheme } from '@/enumerations/ColorSchemeLimited.enum';
import { EnumValues } from '@/enumerations/generic.enum';
import { ComponentProps } from '@/lib/component-props';

export type CtaBannerParams = {
  params?: {
    colorScheme?: EnumValues<typeof ColorScheme>;
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};

export type CtaBannerFields = {
  fields?: {
    titleRequired?: Field<string>;
    descriptionOptional?: Field<string>;
    linkOptional?: LinkField;
  };
};

export type CtaBannerProps = ComponentProps & CtaBannerFields & CtaBannerParams;
