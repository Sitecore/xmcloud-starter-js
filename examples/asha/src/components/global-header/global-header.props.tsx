import { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PlaceholderProps } from '@/types/Placeholder.props';

/**
 * Model used for Sitecore Component integration
 */
export type GlobalHeaderProps = ComponentProps & PlaceholderProps & GlobalHeaderFields;

export type GlobalHeaderFields = {
  isPageEditing: boolean;
  fields: {
    data: {
      item: {
        logo?: {
          jsonValue?: ImageField;
        };
        primaryNavigationLinks?: {
          targetItems?: PrimaryNavItemProps[];
        };
        headerContact?: {
          jsonValue?: LinkField;
        };
      } & UtilityNavigationProps;
    };
  };
};

/**
 * Primary Navigation
 */
export type PrimaryNavProps = {
  utilityNavigationLinks?: UtilityNavigationItemProps[];
  primaryNavigationLinks?: PrimaryNavItemProps[];
};

export type PrimaryNavItemProps = {
  link: {
    jsonValue: LinkField;
  };
} & NavigationDropDownProps;

export type NavigationDropDownProps = {
  children: {
    results?: PrimaryNavItemProps[];
  };
};

export type UtilityNavigationProps = {
  utilityNavigationLinks: {
    targetItems?: UtilityNavigationItemProps[];
  };
};

export type UtilityNavigationItemProps = {
  link: {
    jsonValue: LinkField;
  };
};
