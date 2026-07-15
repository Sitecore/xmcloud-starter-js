import type { LinkField, TextField } from '@sitecore-content-sdk/nextjs';
import type { JSX } from 'react';

export interface NavigationFields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children: Array<NavigationFields>;
  Styles: string[];
}

export type NavigationProps = {
  params?: { [key: string]: string };
  fields?: Record<string, NavigationFields>;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
  isEditing?: boolean;
};

export type NavigationFieldProps = {
  fields?: NavigationFields;
};

export type GetLinkField = (props: NavigationFieldProps) => LinkField;
export type GetNavigationText = (props: NavigationFieldProps) => JSX.Element | string;
