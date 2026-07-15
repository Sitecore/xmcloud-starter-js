import type { ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { CompatibleDatasource, CompatibleField, ComponentProps } from '@/lib/component-props';

export interface HeaderSTFields {
  Logo: CompatibleField<ImageField>;
  SupportLink: CompatibleField<LinkField>;
  SearchLink: CompatibleField<LinkField>;
  CartLink: CompatibleField<LinkField>;
}

export type HeaderSTProps = ComponentProps & {
  params: { [key: string]: string };
  fields: CompatibleDatasource<HeaderSTFields>;
};