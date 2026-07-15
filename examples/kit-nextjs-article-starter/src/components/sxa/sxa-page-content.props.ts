import { RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

export interface PageContentFields {
  Content?: RichTextField;
}

export type PageContentProps = ComponentProps & {
  params: { [key: string]: string };
  fields?: PageContentFields;
};
