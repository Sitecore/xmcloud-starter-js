import { LinkFieldValue } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { GqlFieldString } from '@/types/gql.props';
/**
 * Model used for Sitecore Component integration
 */
export type BreadcrumbsProps = ComponentProps & BreadcrumbsData;

export type BreadcrumbsData = {
  fields: {
    data: {
      datasource: {
        ancestors: BreadcrumbsPage[];
        name: string;
      };
    };
  };
};

export type BreadcrumbsPage = {
  name: string;
  title: GqlFieldString;
  navigationTitle: GqlFieldString;
  url?: LinkFieldValue;
};
