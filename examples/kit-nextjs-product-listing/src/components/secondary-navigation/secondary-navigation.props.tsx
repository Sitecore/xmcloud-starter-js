import { LinkFieldValue } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { GqlFieldString } from '../../utils/graphQlClient';

/**
 * Model used for Sitecore Component integration
 */
export type SecondaryNavigationProps = ComponentProps & SecondaryNavigationFields;

export type SecondaryNavigationFields = {
  fields: {
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
};

export type SecondaryNavigationPage = {
  id: string;
  name: string;
  displayName?: string;
  title?: GqlFieldString;
  navigationTitle?: GqlFieldString;
  url?: LinkFieldValue;
};
