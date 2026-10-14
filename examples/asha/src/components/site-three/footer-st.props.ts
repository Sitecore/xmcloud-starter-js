import type { Field, LinkField, RichTextField } from '@sitecore-content-sdk/nextjs';
import type { CompatibleDatasource, CompatibleField, ComponentProps } from '@/lib/component-props';

export interface FooterSTFields {
  Title: CompatibleField<Field<string>>;
  CopyrightText: CompatibleField<RichTextField>;
  FacebookLink: CompatibleField<LinkField>;
  InstagramLink: CompatibleField<LinkField>;
  LinkedinLink: CompatibleField<LinkField>;
}

export type FooterSTProps = ComponentProps & {
  params: { [key: string]: string };
  fields: CompatibleDatasource<FooterSTFields>;
};

export type SocialLinksProps = {
  fields: FooterSTFields | undefined;
};