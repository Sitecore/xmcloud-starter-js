import type { Field, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';

export type ArticleContentRouteFields = {
  Content?: RichTextField;
  pageHeaderTitle?: Field<string>;
  pageShortTitle?: Field<string>;
  pageSubtitle?: Field<string>;
  pageSummary?: Field<string>;
  pageTitle?: Field<string>;
  pageDisplayDate?: Field<string>;
  pageReadTime?: Field<string>;
};

export type ArticleContentProps = ComponentProps;
