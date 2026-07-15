import type { TextField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type NavigationFields = {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children: NavigationFields[];
  Styles: string[];
};

export type NavigationProps = OptionalComponentProps & {
  fields?: Record<string, NavigationFields>;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  relativeLevel: number;
  isEditing?: boolean;
};

