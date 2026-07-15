import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';

export type ResultsFieldLink = {
  field: {
    link: LinkField;
  };
};

export interface LinkListFields {
  data?: {
    datasource?: {
      children?: {
        results?: ResultsFieldLink[];
      };
      field?: {
        title?: TextField;
      };
    };
  };
}

export type LinkListProps = {
  params: { [key: string]: string };
  fields?: LinkListFields;
};

export type LinkListItemProps = {
  key: string;
  index: number;
  total: number;
  field: LinkField;
  isPageEditing?: boolean;
};
