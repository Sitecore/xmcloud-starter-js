import { LinkField } from '@sitecore-content-sdk/nextjs';
import type { JSX } from 'react';
import { NavigationFields } from './sxa-navigation.props';

export type NavigationListProps = {
  fields?: NavigationFields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
  isEditing: boolean;
  getLinkField: (props: { fields?: NavigationFields }) => LinkField;
  getNavigationText: (props: { fields?: NavigationFields }) => JSX.Element | string;
};
