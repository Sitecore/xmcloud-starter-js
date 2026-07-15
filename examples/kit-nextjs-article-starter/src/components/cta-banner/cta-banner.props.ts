/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ColorSchemeLimited as ColorScheme } from '@/enumerations/ColorSchemeLimited.enum';
import { EnumValues } from '@/enumerations/generic.enum';

export type CtaBannerParams = {
  params?: {
    colorScheme?: EnumValues<typeof ColorScheme>;
    [key: string]: any;
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
