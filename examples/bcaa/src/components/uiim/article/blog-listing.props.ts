import type { Field, ImageField, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps, GraphQLField } from '@/lib/component-props';

export type BlogListingArticle = {
  id?: string;
  name?: string;
  url?: { path?: string };
  pageTitle?: GraphQLField<Field<string>>;
  pageHeaderTitle?: GraphQLField<Field<string>>;
  pageShortTitle?: GraphQLField<Field<string>>;
  pageSummary?: GraphQLField<Field<string>>;
  pageDisplayDate?: GraphQLField<Field<string>>;
  pageReadTime?: GraphQLField<Field<string>>;
  pageThumbnail?: GraphQLField<ImageField> & { value?: ImageField['value'] };
};

export type BlogListingDatasource = {
  title?: GraphQLField<Field<string>>;
  intro?: GraphQLField<RichTextField>;
  emptyResultsText?: GraphQLField<Field<string>>;
  showFilters?: GraphQLField<Field<boolean>>;
  filterFacets?: GraphQLField<Field<string>>;
  filterFacetLabel?: GraphQLField<Field<string>>;
  searchPlaceholder?: GraphQLField<Field<string>>;
  blogsRoot?: {
    jsonValue?: Field<string>;
    targetItem?: {
      children?: {
        results?: BlogListingArticle[];
      };
    };
  };
};

export type BlogListingFields = {
  data?: {
    datasource?: BlogListingDatasource;
    contextItem?: {
      children?: {
        results?: BlogListingArticle[];
      };
    };
  };
};

export type BlogListingProps = ComponentProps & {
  fields?: BlogListingFields;
  isPageEditing?: boolean;
};
