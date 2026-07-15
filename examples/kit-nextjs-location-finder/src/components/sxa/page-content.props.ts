import type { LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import type { OptionalComponentProps } from '@/lib/component-props';

export type PageContentFields = {
  Title?: TextField;
  Content?: RichTextField;
  MainLink?: LinkField;
};

export type PageContentProps = OptionalComponentProps & {
  fields?: PageContentFields;
};

export type PageContentComponentContentProps = {
  id?: string;
  styles?: string;
  children: React.ReactElement;
};

