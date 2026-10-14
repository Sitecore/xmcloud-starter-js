import type { LinkField, RichTextField, TextField } from '@sitecore-content-sdk/nextjs';
import type { ComponentProps } from '@/lib/component-props';
import type { JSX } from 'react';

export interface PageContentFields {
  Title?: TextField;
  Content?: RichTextField;
  MainLink?: LinkField;
}

export type PageContentProps = ComponentProps & {
  params: { [key: string]: string };
  fields?: PageContentFields;
};

export type ComponentContentProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};
