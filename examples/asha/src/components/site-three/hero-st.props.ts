import type { Field, ImageField, LinkField } from '@sitecore-content-sdk/nextjs';
import type { CompatibleDatasource, CompatibleField } from '@/lib/component-props';

export interface HeroSTFields {
  Eyebrow: CompatibleField<Field<string>>;
  Title: CompatibleField<Field<string>>;
  Image1: CompatibleField<ImageField>;
  Image2: CompatibleField<ImageField>;
  Link1: CompatibleField<LinkField>;
  Link2: CompatibleField<LinkField>;
}

export type PageHeaderSTProps = {
  params: { [key: string]: string };
  fields: CompatibleDatasource<HeroSTFields>;
};