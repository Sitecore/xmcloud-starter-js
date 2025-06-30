import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';

import { ComponentProps } from '@/lib/component-props';

interface ArticleHeaderParams {
  [key: string]: any; // eslint-disable-line
}

export type ReferenceField = {
  id: string;
  name: string;
  url?: string;
  displayName?: string;
  fields?: {
    [key: string]: Field | ReferenceField | null;
  };
};

export type AuthorReferenceField = ReferenceField & {
  fields: PersonItem;
};

export type AuthorItemFields = {
  name: Field<string>;
  jobTitle: Field<string>;
};

interface ArticleHeaderFields {
  imageRequired?: ImageField;
  eyebrowOptional?: Field<string>;
  pageDisplayDate?: Field<string>;
  pageAuthor?: Field<string>;
}

interface ArticleHeaderExternalFields {
  pageHeaderTitle: Field<string>;
  pageReadTime?: Field<string>;
  pageDisplayDate?: Field<string>;
  pageAuthor?: { value: PersonItem };
}

export interface ArticleHeaderProps extends ComponentProps {
  params: ArticleHeaderParams;
  fields: ArticleHeaderFields;
  externalFields: ArticleHeaderExternalFields;
}

export interface PersonItem extends ComponentProps {
  personProfileImage?: ImageField;
  personFirstName: Field<string>;
  personLastName: Field<string>;
  personJobTitle?: Field<string>;
  personBio?: Field<string>;
  personLinkedIn?: LinkField;
}
