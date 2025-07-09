import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PlaceholderProps } from '@/types/Placeholder.props';

import type { JSX } from 'react';

export type GlobalFooterProps = ComponentProps &
  PlaceholderProps &
  GlobalFooterFields & {
    callout?: JSX.Element;
    isPageEditing: boolean;
  };

export type GlobalFooterFields = {
  fields: {
    data: {
      datasource: {
        footerNavLinks: {
          results: FooterNavigationLink[];
        };
        socialLinks: { results: FooterSocialLink[] };
        tagline?: { jsonValue: Field<string> };
        emailSubscriptionTitle?: { jsonValue: Field<string> };
        footerCopyright?: { jsonValue: Field<string> };
      };
    };
    dictionary: {
      FOOTER_EmailSubmitLabel: string;
      FOOTER_EmailPlaceholder: string;
      FOOTER_EmailErrorMessage: string;
      FOOTER_EmailSuccessMessage: string;
    };
  };
};

export type FooterSocialLink = {
  link: { jsonValue: LinkField };
  socialIcon: { jsonValue: ImageField };
};

export type FooterNavigationColumnProps = {
  listClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  indicatorClassName?: string;
  alignItems?: 'start' | 'end' | 'center';
  parentRef: React.RefObject<HTMLDivElement | null>;
  isPageEditing: boolean;
  header?: {
    jsonValue: Field<string>;
  };
  items?: FooterNavigationLink[];
};

export type FooterNavigationLink = {
  link: {
    jsonValue: LinkField;
  };
};
