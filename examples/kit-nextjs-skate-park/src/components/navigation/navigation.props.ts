import { CompatibleField, ComponentProps } from 'lib/component-props';
import { LinkField, TextField } from '@sitecore-content-sdk/nextjs';

export interface NavigationFields {
  Id: string;
  DisplayName: string;
  Title: CompatibleField<TextField>;
  NavigationTitle: CompatibleField<TextField>;
  Href: string;
  Querystring: string;
  Children: Array<NavigationFields>;
  Styles: string[];
}

export interface NavigationListItemProps {
  fields?: NavigationFields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
}

export interface NavigationProps extends ComponentProps {
  fields?: NavigationFields;
}

export type NavigationLinkField = LinkField;
