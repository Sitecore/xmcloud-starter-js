/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, ImageField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { AuthorReferenceField } from '@/types/AuthorTaxonomy.props';

export interface ArticleHeaderParams {
  [key: string]: any;
}

export interface ArticleHeaderFields {
  imageRequired?: { jsonValue: ImageField };
  eyebrowOptional?: { jsonValue: Field<string> };
}

export interface ArticleHeaderExternalFields {
  pageHeaderTitle: { jsonValue: Field<string> };
  pageReadTime?: { jsonValue: Field<string> };
  pageDisplayDate?: { jsonValue: Field<string> };
  pageAuthor?: { jsonValue: AuthorReferenceField };
}

export interface ArticleHeaderProps extends ComponentProps {
  params: ArticleHeaderParams;
  fields?: {
    data?: {
      datasource?: ArticleHeaderFields;
      externalFields?: ArticleHeaderExternalFields;
    };
  };
}
