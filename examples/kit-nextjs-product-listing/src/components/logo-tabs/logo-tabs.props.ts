import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { EnumValues } from '@/enumerations/generic.enum';
import { ComponentProps } from '@/lib/component-props';
import { ColorSchemeLimited } from '@/enumerations/ColorSchemeLimited.enum';

interface LogoTabsParams {
  colorScheme?: EnumValues<typeof ColorSchemeLimited>;
  [key: string]: any; // eslint-disable-line
}

export interface LogoTabContent {
  heading: { jsonValue: Field<string> };
  cta: { jsonValue: LinkField };
}

export interface LogoTabsFields {
  data: {
    datasource: {
      title: { jsonValue: Field<string> };
      backgroundImage?: { jsonValue: ImageField };
      logos?: {
        results: LogoItemProps[];
      };
      logoTabContent?: {
        results: LogoTabContent[];
      };
    };
  };
}

export interface LogoTabsProps extends ComponentProps {
  params: LogoTabsParams;
  fields: LogoTabsFields;
}

export type LogoItemProps = {
  title: {
    jsonValue: Field<string>;
  };
  logo: { jsonValue: ImageField };
};
