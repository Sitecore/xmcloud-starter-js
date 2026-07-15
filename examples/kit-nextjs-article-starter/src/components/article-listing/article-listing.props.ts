/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { ReferenceField } from '@/types/ReferenceField.props';
import { AuthorReferenceField } from '@/types/AuthorTaxonomy.props';

export interface ArticleListingParams {
  [key: string]: any;
}

export interface ArticleItem {
  pageTitle: Field<string>;
  pageSummary: Field<string>;
  pageThumbnail: ImageField;
  pageReadTime: Field<string>;
  taxAuthor: AuthorReferenceField;
}

export type ArticleItemReferenceField = ReferenceField & {
  fields?: ArticleItem;
};

export interface ArticleListingFields {
  titleOptional?: Field<string>;
  descriptionOptional?: Field<string>;
  linkOptional?: LinkField;
  featuredContent?: ArticleItemReferenceField[];
}

export interface ArticleListingProps extends ComponentProps {
  params: ArticleListingParams;
  fields?: ArticleListingFields;
  isPageEditing?: boolean;
}

export interface TransformedArticle {
  link: string;
  image: string;
  title: string;
  summary: string;
  author: string;
  authorImage: string;
  readTime: string;
}
