import type {
  ComponentProps,
  IGQLImageField,
  IGQLLinkField,
  IGQLRichTextField,
  IGQLTextField,
} from '@/lib/component-props';

export interface LogoFields {
  logoImage: IGQLImageField;
  logoLink: IGQLLinkField;
}

export interface LogoCloudDatasourceFields {
  data: {
    datasource: {
      children: {
        results: LogoFields[];
      };
      title: IGQLTextField;
      bodyText: IGQLRichTextField;
      link1: IGQLLinkField;
      link2: IGQLLinkField;
    };
  };
}

export type LogoCloudProps = ComponentProps & {
  params: { [key: string]: string };
  fields: LogoCloudDatasourceFields;
};
