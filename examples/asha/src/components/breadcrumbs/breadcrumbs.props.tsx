import { LinkFieldValue } from '@sitecore-content-sdk/nextjs';
import { CompatibleDatasource, CompatibleField, ComponentProps } from '@/lib/component-props';
import { Field } from '@sitecore-content-sdk/nextjs';
import { GqlFieldString } from '@/types/gql.props';
/**
 * Model used for Sitecore Component integration
 */
export type BreadcrumbsProps = ComponentProps & BreadcrumbsData;

export type BreadcrumbsData = {
  fields: CompatibleDatasource<{
    ancestors: BreadcrumbsPage[];
    name: string;
  }>;
};

export type BreadcrumbsPage = {
  name: string;
  title: CompatibleField<Field<string>>;
  navigationTitle: CompatibleField<Field<string>>;
  url?: LinkFieldValue;
};
