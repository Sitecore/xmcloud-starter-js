import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { EnumValues } from '@/enumerations/generic.enum';
import { CompatibleDatasource, CompatibleField, ComponentProps } from '@/lib/component-props';
import { ColorSchemeLimited } from '@/enumerations/ColorSchemeLimited.enum';

interface LogoTabsParams {
  colorScheme?: EnumValues<typeof ColorSchemeLimited>;
  [key: string]: any; // eslint-disable-line
}

export interface LogoTabContent {
  heading: CompatibleField<Field<string>>;
  cta: CompatibleField<LinkField>;
}

export interface LogoTabsDatasource {
  title: CompatibleField<Field<string>>;
  backgroundImage?: CompatibleField<ImageField>;
  logos?: {
    results: LogoItemProps[];
  };
  logoTabContent?: {
    results: LogoTabContent[];
  };
}

export interface LogoTabsFields {
  data: {
    datasource: LogoTabsDatasource;
  };
}

export interface LogoTabsProps extends ComponentProps {
  params: LogoTabsParams;
  fields: CompatibleDatasource<LogoTabsDatasource>;
}

export type LogoItemProps = {
  title: CompatibleField<Field<string>>;
  logo: CompatibleField<ImageField>;
};
