import { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { PlaceholderProps } from '@/types/Placeholder.props';
import { type JSX } from 'react';

export type GlobalFooterProps = ComponentProps &
  PlaceholderProps &
  GlobalFooterFields & {
    callout?: JSX.Element;
  };

export type GlobalFooterFields = {
  fields: {
    data: {
      datasource: {
        footerLogo?: { jsonValue: ImageField };
        footerPromoTitle?: { jsonValue: Field<string> };
        footerPromoDescription?: { jsonValue: Field<string> };
        footerPromoLink?: { jsonValue: LinkField };
        footerSocialLinks?: { results: FooterSocialLink[] };
        footerCopyright?: { jsonValue: Field<string> };
      };
    };
  };
};

export type FooterNavigationColumnProps = ComponentProps & {
  fields: {
    data: {
      datasource: {
        header: {
          jsonValue: Field<string>;
        };
        items?: {
          results: FooterNavigationLink[];
        };
      };
    };
  };
};

export type FooterSocialLink = {
  link: { jsonValue: LinkField };
  socialIcon: { jsonValue: ImageField };
};

export type FooterNavigationLink = {
  link: {
    jsonValue: LinkField;
  };
};
