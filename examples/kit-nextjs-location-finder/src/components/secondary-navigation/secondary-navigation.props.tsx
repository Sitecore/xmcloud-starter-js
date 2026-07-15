import type { LinkFieldValue } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';
import type { GqlFieldString } from '@/utils/graphQlClient';

export type SecondaryNavigationPage = {
  id: string;
  name: string;
  displayName?: string;
  title?: GqlFieldString;
  navigationTitle?: GqlFieldString;
  url?: LinkFieldValue;
};

export type SecondaryNavigationFields = {
  data: {
    datasource: {
      id: string;
      children: {
        results: SecondaryNavigationPage[];
      };
      parent: {
        children?: {
          results: SecondaryNavigationPage[];
        };
      };
    };
  };
};

export type SecondaryNavigationProps = OptionalComponentProps & {
  fields: SecondaryNavigationFields;
};

