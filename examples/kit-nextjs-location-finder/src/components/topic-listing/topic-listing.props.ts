import { Field, LinkField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';
import { IconName } from '@/enumerations/Icon.enum';

export interface TopicListingParams {
  backgroundTheme: Field<string>;
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface TopicListingFields {
  data: {
    datasource: {
      title: { jsonValue: Field<string> };
      children?: {
        results: TopicItemProps[];
      };
    };
  };
}

export interface TopicListingProps extends OptionalComponentProps {
  params: TopicListingParams;
  fields: TopicListingFields;
}

export type TopicItemProps = {
  link?: {
    jsonValue?: LinkField;
  };
  icon: {
    jsonValue: {
      value: (typeof IconName)[keyof typeof IconName];
    };
  };
};

