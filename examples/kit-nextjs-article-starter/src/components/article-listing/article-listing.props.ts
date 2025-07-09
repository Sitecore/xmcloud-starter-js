import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

import { ComponentProps } from '@/lib/component-props';
import { ReferenceField } from '@/types/ReferenceField.props';
import { AuthorReferenceField } from '@/types/AuthorTaxonomy.props';

interface ArticleListingParams {
  [key: string]: any; // eslint-disable-line
}

export type ArticleItemReferenceField = ReferenceField & {
  fields: ArticleItem;
};

interface ArticleItem {
  pageTitle: Field<string>;
  pageSummary: Field<string>;
  pageThumbnail: ImageField;
  pageReadTime: Field<string>;
  taxAuthor: AuthorReferenceField;
}

interface ArticleListingFields {
  titleOptional?: Field<string>;
  descriptionOptional?: Field<string>;
  linkOptional?: LinkField;
  featuredContent: ArticleItemReferenceField[];
}

export interface ArticleListingProps extends ComponentProps {
  params: ArticleListingParams;
  fields: ArticleListingFields;
  isPageEditing?: boolean;
}
