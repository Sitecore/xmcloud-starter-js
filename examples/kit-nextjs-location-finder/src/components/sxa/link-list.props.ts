import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type LinkListResultFieldLink = {
  field: {
    link: LinkField;
  };
};

export type LinkListFields = {
  data?: {
    datasource?: {
      children?: {
        results?: LinkListResultFieldLink[];
      };
      field?: {
        title?: TextField;
      };
    };
  };
};

export type LinkListProps = OptionalComponentProps & {
  fields?: LinkListFields;
};

export type LinkListItemProps = {
  key: string;
  index: number;
  total: number;
  field: LinkField;
};

