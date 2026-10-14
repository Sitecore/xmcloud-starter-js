import { Field } from '@sitecore-content-sdk/nextjs';

export type PageTitles = {
  pageTitle: Field<string>;
  pageSubtitle?: Field<string>;
  pageShortTitle?: Field<string>;
  pageHeaderTitle: Field<string>;
  dynamicListingTitle?: Field<string>;
};
