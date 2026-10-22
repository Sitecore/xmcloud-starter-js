import { CompatibleDatasource, ComponentProps } from 'lib/component-props';
import { LinkField, TextField } from '@sitecore-content-sdk/nextjs';

export interface LinkListProps extends ComponentProps {
  fields?: CompatibleDatasource<{
    children?: {
      results?: Array<{
        field?: {
          link?: LinkField;
        };
      }>;
    };
    field?: {
      title?: TextField;
    };
  }>;
}

export interface LinkListItemProps {
  index: number;
  total: number;
  field: LinkField;
}
