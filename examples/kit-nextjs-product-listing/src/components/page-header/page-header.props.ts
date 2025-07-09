import { ImageField, Field, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

interface PageHeaderParams {
  [key: string]: any; // eslint-disable-line
}

interface PageHeaderFields {
  data: {
    datasource: {
      imageRequired: {
        jsonValue: ImageField;
      };
      link1?: {
        jsonValue: LinkField;
      };
      link2?: {
        jsonValue: LinkField;
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
}

export interface PageHeaderProps extends ComponentProps {
  params: PageHeaderParams;
  fields: PageHeaderFields;
}
