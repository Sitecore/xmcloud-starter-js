import { Field, Item, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
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
    [key: string]: Field | Item[] | ReferenceField | null;
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
  imageRequired?: { jsonValue: ImageField };
  eyebrowOptional?: { jsonValue: Field<string> };
}

interface ArticleHeaderExternalFields {
  pageHeaderTitle: { jsonValue: Field<string> };
  pageReadTime?: { jsonValue: Field<string> };
  pageDisplayDate?: { jsonValue: Field<string> };
  pageAuthor?: { jsonValue: AuthorReferenceField };
}

export interface ArticleHeaderProps extends ComponentProps {
  params: ArticleHeaderParams;
  fields: {
    data: {
      datasource: ArticleHeaderFields;
      externalFields: ArticleHeaderExternalFields;
    };
  };
}

export interface PersonItem {
  personProfileImage?: ImageField;
  personFirstName: Field<string>;
  personLastName: Field<string>;
  personJobTitle?: Field<string>;
  personBio?: Field<string>;
  personLinkedIn?: LinkField;
}
