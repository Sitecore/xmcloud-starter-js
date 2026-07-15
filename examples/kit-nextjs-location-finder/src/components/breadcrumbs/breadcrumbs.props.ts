import type { LinkFieldValue } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';
import type { GqlFieldString } from '@/types/gql.props';

export type BreadcrumbsPage = {
  name: string;
  title: GqlFieldString;
  navigationTitle: GqlFieldString;
  url?: LinkFieldValue;
};

export type BreadcrumbsFields = {
  data: {
    datasource: {
      ancestors: BreadcrumbsPage[];
      name: string;
    };
  };
};

export type BreadcrumbsProps = OptionalComponentProps & {
  fields: BreadcrumbsFields;
};

