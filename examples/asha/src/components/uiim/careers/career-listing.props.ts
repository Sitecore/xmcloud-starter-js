import type { Field, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps, GraphQLField } from '@/lib/component-props';

export type CareerListingJob = {
  id?: string;
  name?: string;
  path?: string;
  url?: { path?: string };
  jobTitle?: GraphQLField<Field<string>>;
  employer?: GraphQLField<Field<string>>;
  city?: GraphQLField<Field<string>>;
  state?: GraphQLField<Field<string>>;
  location?: GraphQLField<Field<string>>;
  salary?: GraphQLField<Field<string>>;
  positionType?: GraphQLField<Field<string>>;
  jobCategory?: GraphQLField<Field<string>>;
  education?: GraphQLField<Field<string>>;
  spotlight?: GraphQLField<Field<boolean>>;
  postedDate?: GraphQLField<Field<string>>;
};

export type CareerListingSource = {
  title?: GraphQLField<Field<string>>;
  intro?: GraphQLField<RichTextField>;
  emptyResultsText?: GraphQLField<Field<string>>;
  showFilters?: GraphQLField<Field<boolean>>;
  parent?: {
    parent?: {
      children?: {
        results?: CareerListingJob[];
      };
    };
  };
};

export type CareerListingFields = {
  data?: {
    datasource?: CareerListingSource;
    jobs?: {
      results?: CareerListingJob[];
    };
  };
  datasource?: CareerListingSource;
};

export type CareerListingProps = ComponentProps & {
  fields?: CareerListingFields;
};
