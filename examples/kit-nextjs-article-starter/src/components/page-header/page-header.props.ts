import { ImageField, Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { EnumValues } from '@/enumerations/generic.enum';
import { ColorSchemeLimited } from '@/enumerations/ColorSchemeLimited.enum';
import { ComponentProps } from '@/lib/component-props';

interface PageHeaderParams {
  colorScheme?: EnumValues<typeof ColorSchemeLimited> | 'default';
  darkPlayIcon?: '0' | '1';
  [key: string]: any; // eslint-disable-line
}

interface PageHeaderLogos {
  image?: {
    jsonValue?: ImageField;
  };
}

export interface PageHeaderProps extends ComponentProps {
  params: PageHeaderParams;
  fields: {
    data: {
      datasource?: {
        imageRequired: {
          jsonValue: ImageField;
        };
        videoOptional?: {
          jsonValue: LinkField;
        };
        logoText?: {
          jsonValue: Field<string>;
        };
        children?: {
          results: PageHeaderLogos[];
        };
      };
      externalFields: {
        pageTitle: {
          jsonValue: Field<string>;
        };
        pageHeaderTitle: {
          jsonValue: Field<string>;
        };
        pageSubtitle: {
          jsonValue: Field<string>;
        };
      };
    };
  };
}
