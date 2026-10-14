import { Field, Item } from '@sitecore-content-sdk/nextjs';

export type ReferenceField = {
  id: string;
  name: string;
  url?: string;
  displayName?: string;
  fields?: {
    [key: string]: Field | Item[] | ReferenceField | null;
  };
};
