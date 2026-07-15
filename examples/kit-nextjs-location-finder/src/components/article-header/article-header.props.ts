import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type ArticleHeaderParams = {
  [key: string]: unknown;
};

export type ArticleHeaderFields = {
  imageRequired?: ImageField;
  eyebrowOptional?: Field<string>;
  pageDisplayDate?: Field<string>;
  pageAuthor?: Field<string>;
};

export type PersonItem = {
  personProfileImage?: ImageField;
  personFirstName: Field<string>;
  personLastName: Field<string>;
  personJobTitle?: Field<string>;
  personBio?: Field<string>;
  personLinkedIn?: LinkField;
};

export type ArticleHeaderExternalFields = {
  pageHeaderTitle: Field<string>;
  pageReadTime?: Field<string>;
  pageDisplayDate?: Field<string>;
  pageAuthor?: { value: PersonItem };
};

export type ArticleHeaderProps = OptionalComponentProps & {
  params: ArticleHeaderParams;
  fields: ArticleHeaderFields;
  externalFields: ArticleHeaderExternalFields;
};

