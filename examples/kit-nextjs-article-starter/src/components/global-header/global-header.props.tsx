import { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PlaceholderProps } from '@/types/Placeholder.props';
import { GqlField } from '@/types/gql.props';

/**
 * Model used for Sitecore Component integration
 */
export type GlobalHeaderProps = ComponentProps & PlaceholderProps & GlobalHeaderFields;

export type GlobalHeaderFields = {
  fields: {
    data: {
      item: {
        logo: {
          jsonValue?: ImageField;
        };
        children: {
          results?: [
            {
              link: GqlField<LinkField>;
            },
          ];
        };
        headerContact: GqlField<LinkField>;
      };
    };
  };
};
